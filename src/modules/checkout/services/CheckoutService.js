const Payment = require("../models/paymentModel");
const Order = require("../../order/models/OrderModel");
const Shop = require("../../shop/models/ShopModel");
const User = require("../../auth/models/UserModel");
const Product = require("../../product/models/ProductModel");
const {
  UserAddress,
  AdministrativeRegion,
  AdministrativeUnit,
  Province,
  District,
  Ward,
} = require("../../user/models/UserAddressModel");
const sequelize = require("../../../config/db/index");
const { startNgrok } = require("../../../config/ngrok/ngrokConfig");
const transporter = require("../../../config/nodemailer/nodemailer");

const { createMoMoPayment, verifyMoMoSignature } = require("./MomoService");
const OrderDetail = require("../../order/models/OrderDetailModel");

const generateTransId = () => {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 900000) + 100000; // 6 chữ số ngẫu nhiên
  const transId = `${timestamp.toString().slice(-6)}${randomPart}`;
  return transId.slice(0, 10);
};

const CreatePayment = async (orderId, paymentMethod) => {
  try {
    if (!orderId || !paymentMethod) {
      throw new Error("Missing required fields");
    }
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error("Order not found");
    }
    const existingPayment = await Payment.findOne({
      where: { orderId: order.id },
    });

    if (existingPayment) {
      if (paymentMethod === "MoMo") {
        const ngrokUrl = await startNgrok();
        const returnUrl = `${process.env.FRONTEND_URL}`;
        const notifyUrl = `${ngrokUrl}/api/checkout/notify`;
        const momoResponse = await createMoMoPayment(
          existingPayment.id,
          existingPayment.amount,
          returnUrl,
          notifyUrl,
          order.totalQuantity
        );
        const responsePayUrl = { payUrl: momoResponse.payUrl };
        return responsePayUrl;
      } else if (paymentMethod === "COD") {
        return null;
      }
    } else {
      const transId = generateTransId();
      if (order.status === "Pending") {
        const payment = await Payment.create({
          orderId: order.id,
          userId: order.userId,
          paymentMethod,
          status: "Pending",
          transactionId: transId,
          amount: order.totalPrice,
        });
        if (paymentMethod === "MoMo") {
          const ngrokUrl = await startNgrok();
          const returnUrl = `${process.env.FRONTEND_URL}`;
          const notifyUrl = `${ngrokUrl}/api/checkout/notify`;
          const momoResponse = await createMoMoPayment(
            payment.id,
            payment.amount,
            returnUrl,
            notifyUrl,
            order.totalQuantity
          );
          const responsePayUrl = { payUrl: momoResponse.payUrl };
          return responsePayUrl;
        } else if (paymentMethod === "COD") {
          return null;
        }
      } else {
        throw new Error("Đơn hàng đã được thanh toán hoặc hết hạn");
      }
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

const handleNotification = async ({
  orderId,
  resultCode,
  transId,
  amount,
  signature,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const data = {
      orderId,
      resultCode,
      transId,
      amount,
    };
    const isValid = verifyMoMoSignature(data, signature);
    if (!isValid) {
      throw new Error("Invalid signature");
    }
    const paymentId = orderId.split("_")[0];
    const payment = await Payment.findOne({
      where: { id: paymentId },
      transaction,
    });
    if (!payment) {
      throw new Error("Payment not found");
    }
    if (payment.status === "Success") {
      throw new Error("Payment already completed");
    }
    if (resultCode === 0) {
      payment.status = "Success";
      payment.transactionId = transId;
    } else {
      payment.status = "Failed";
    }
    await payment.save({ transaction });
    const order = await Order.findOne({
      where: { id: payment.orderId },
      transaction,
    });
    if (order) {
      switch (resultCode) {
        case 0:
          order.status = "Paid";
          break;
        case 1:
          order.status = "Failed";
          break;
        case 2:
          order.status = "Refunded";
          break;
        case 3:
          order.status = "Expired";
          break;
        default:
          order.status = "Pending";
      }
    }
    await order.save({ transaction });
    await transaction.commit();

    if (order.status === "Paid") {
      const shop = await Shop.findOne({
        where: { id: order.shopId },
      });
      const address = await UserAddress.findOne({
        where: { id: order.addressId },
        include: [
          {
            model: Province,
            as: "Province",
            attributes: ["code", "name"],
          },
          {
            model: District,
            as: "District",
            attributes: ["code", "name"],
          },
          {
            model: Ward,
            as: "Ward",
            attributes: ["code", "name"],
          },
        ],
      });
      const orderDetails = await OrderDetail.findAll({
        where: { orderId: payment.orderId },
        include: [
          {
            model: Product,
            as: "Product",
            attributes: ["productName"],
          },
        ],
      });
      const mailOptions = {
        from: `AureoMall <${process.env.USER_MAIL}>`,
        to: shop.email,
        subject: `Thông báo về đơn hàng mới - Khách hàng đã thanh toán thành công - AureoMall`,
        text: `Hello ${shop.shopName},

      Chúng tôi xin thông báo rằng đơn hàng của bạn đã được thanh toán thành công từ khách hàng. Dưới đây là thông tin chi tiết về đơn hàng:

      Thông tin đơn hàng:
      Mã đơn hàng: ${order.id}
      Tên khách hàng: ${address.fullName}
      Số điện thoại: ${address.phoneNumber}
      Địa chỉ giao hàng: ${address.address}, ${address.Ward.name}, ${
          address.District.name
        }, ${address.Province.name}
      Tổng giá trị đơn hàng: ${order.totalPrice} VNĐ
      Phương thức thanh toán: ${payment.paymentMethod}

      Thông tin sản phẩm trong đơn hàng:
      ${orderDetails
        .map(
          (product) =>
            `${product.Product.productName} - ${product.optionName} - ${product.optionValue}- ${product.quantity}- ${product.unitPrice} x ${product.subtotal} VNĐ`
        )
        .join("\n")}

      Chúng tôi yêu cầu bạn xác nhận đơn hàng này và tiến hành chuẩn bị sản phẩm cho khách hàng. Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi ngay.
      Cảm ơn bạn đã đồng hành cùng chúng tôi và mong được tiếp tục phục vụ bạn.

      Liên hệ:
        Email: ${process.env.USER_MAIL}
      Trân trọng, Đội ngũ Aureo Mall`,

        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <table width="100%" style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
              <tr>
                <td style="background-color: #4CAF50; padding: 20px; text-align: center; color: #fff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  <h2 style="margin: 0;">AureoMall</h2>
                  <p style="margin: 0; font-size: 1.1em;">Thông báo về đơn hàng mới - Khách hàng đã thanh toán thành công</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <p><strong>Xin chào ${shop.shopName},</strong></p>
                  <p>Chúng tôi xin thông báo rằng đơn hàng của bạn đã được thanh toán thành công từ khách hàng. Dưới đây là thông tin chi tiết về đơn hàng:</p>

                  <table width="100%" style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Mã đơn hàng</th>
                      <td style="padding: 8px;">${order.id}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tên khách hàng</th>
                      <td style="padding: 8px;">${address.fullName}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Số điện thoại</th>
                      <td style="padding: 8px;">${address.phoneNumber}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Địa chỉ giao hàng</th>
                      <td style="padding: 8px;">${address.address}, ${
          address.Ward.name
        }, ${address.District.name}, ${address.Province.name}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tổng giá trị đơn hàng</th>
                      <td style="padding: 8px;">${order.totalPrice} VNĐ</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Phương thức thanh toán</th>
                      <td style="padding: 8px;">${payment.paymentMethod}</td>
                    </tr>
                  </table>

                  <p><strong>Thông tin sản phẩm trong đơn hàng:</strong></p>
                  <table width="100%" style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
                    <thead>
                      <tr>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tên sản phẩm</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Lựa chọn</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Số lượng</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Giá (VNĐ)</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tổng giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderDetails
                        .map(
                          (product) => `
                        <tr>
                          <td style="padding: 8px;">${product.Product.productName}</td>
                          <td style="padding: 8px;">${product.optionName} - ${product.optionValue}</td>
                          <td style="padding: 8px;">${product.quantity}</td>
                          <td style="padding: 8px;">${product.unitPrice} VNĐ</td>
                          <td style="padding: 8px;">${product.subtotal} VNĐ</td>
                        </tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>

                  <p><strong>Chúng tôi yêu cầu bạn xác nhận đơn hàng này và tiến hành chuẩn bị sản phẩm cho khách hàng.</strong></p>
                  <p>Nếu có bất kỳ vấn đề gì, vui lòng liên hệ với chúng tôi ngay. Cảm ơn bạn đã đồng hành cùng chúng tôi và mong được tiếp tục phục vụ bạn.</p>

                  <p><strong>Liên hệ:</strong></p>
                  <p>Email: <a href="mailto:${
                    process.env.USER_MAIL
                  }" style="color: #4CAF50;">${process.env.USER_MAIL}</a></p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 0.9em; color: #555; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p>Need further assistance? Contact us at <a href="mailto:${
                    process.env.USER_MAIL
                  }" style="color: #4CAF50;">${process.env.USER_MAIL}</a></p>
                  <p>&copy; 2024 AureoMall. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>`,
      };
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
    }
    if (order.status === "Failed") {
      const user = await User.findOne({
        where: { id: order.userId },
      });
      const address = await UserAddress.findOne({
        where: { id: order.addressId },
        include: [
          {
            model: Province,
            as: "Province",
            attributes: ["code", "name"],
          },
          {
            model: District,
            as: "District",
            attributes: ["code", "name"],
          },
          {
            model: Ward,
            as: "Ward",
            attributes: ["code", "name"],
          },
        ],
      });
      const orderDetails = await OrderDetail.findAll({
        where: { orderId: payment.orderId },
        include: [
          {
            model: Product,
            as: "Product",
            attributes: ["productName"],
          },
        ],
      });
      const mailOptions = {
        from: `AureoMall <${process.env.USER_MAIL}>`,
        to: user.email,
        subject: `Thông báo hủy đơn hàng - AureoMall`,
        text: `Hello ${user.firstName} ${user.lastName},
      
      Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy vì chưa được thanh toán hoặc đã quá hạn. Dưới đây là thông tin chi tiết về đơn hàng:
      
      Thông tin đơn hàng:
      Mã đơn hàng: ${order.id}
      Tên khách hàng: ${address.fullName}
      Số điện thoại: ${address.phoneNumber}
      Địa chỉ giao hàng: ${address.address}, ${address.Ward.name}, ${
          address.District.name
        }, ${address.Province.name}
      Tổng giá trị đơn hàng: ${order.totalPrice} VNĐ
      Phương thức thanh toán: ${payment.paymentMethod}
      
      Thông tin sản phẩm trong đơn hàng:
      ${orderDetails
        .map(
          (product) =>
            `${product.Product.productName} - ${product.optionName} - ${product.optionValue} - ${product.quantity} - ${product.unitPrice} x ${product.subtotal} VNĐ`
        )
        .join("\n")}
      
      Chúng tôi rất tiếc vì sự bất tiện này. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi.
      
      Liên hệ:
        Email: ${process.env.USER_MAIL}
      
      Trân trọng, Đội ngũ AureoMall`,

        html: `
          <div style="font-family: Arial, sans-serif; color: #333;">
            <table width="100%" style="max-width: 600px; margin: auto; border: 1px solid #ddd; border-radius: 8px;">
              <tr>
                <td style="background-color: #f44336; padding: 20px; text-align: center; color: #fff; border-top-left-radius: 8px; border-top-right-radius: 8px;">
                  <h2 style="margin: 0;">AureoMall</h2>
                  <p style="margin: 0; font-size: 1.1em;">Thông báo hủy đơn hàng</p>
                </td>
              </tr>
              <tr>
                <td style="padding: 20px;">
                  <p><strong>Xin chào ${user.firstName} ${
          user.lastName
        },</strong></p>
                  <p>Chúng tôi rất tiếc phải thông báo rằng đơn hàng của bạn đã bị hủy vì chưa được thanh toán hoặc đã quá hạn. Dưới đây là thông tin chi tiết về đơn hàng:</p>
      
                  <table width="100%" style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Mã đơn hàng</th>
                      <td style="padding: 8px;">${order.id}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tên khách hàng</th>
                      <td style="padding: 8px;">${address.fullName}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Số điện thoại</th>
                      <td style="padding: 8px;">${address.phoneNumber}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Địa chỉ giao hàng</th>
                      <td style="padding: 8px;">${address.address}, ${
          address.Ward.name
        }, ${address.District.name}, ${address.Province.name}</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tổng giá trị đơn hàng</th>
                      <td style="padding: 8px;">${order.totalPrice} VNĐ</td>
                    </tr>
                    <tr>
                      <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Phương thức thanh toán</th>
                      <td style="padding: 8px;">${payment.paymentMethod}</td>
                    </tr>
                  </table>
      
                  <p><strong>Thông tin sản phẩm trong đơn hàng:</strong></p>
                  <table width="100%" style="border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd;">
                    <thead>
                      <tr>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tên sản phẩm</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Lựa chọn</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Số lượng</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Giá (VNĐ)</th>
                        <th style="padding: 8px; background-color: #f4f4f4; text-align: left;">Tổng giá</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${orderDetails
                        .map(
                          (product) => `
                        <tr>
                          <td style="padding: 8px;">${product.Product.productName}</td>
                          <td style="padding: 8px;">${product.optionName} - ${product.optionValue}</td>
                          <td style="padding: 8px;">${product.quantity}</td>
                          <td style="padding: 8px;">${product.unitPrice} VNĐ</td>
                          <td style="padding: 8px;">${product.subtotal} VNĐ</td>
                        </tr>`
                        )
                        .join("")}
                    </tbody>
                  </table>
      
                  <p>Chúng tôi rất tiếc vì sự bất tiện này. Nếu bạn có bất kỳ thắc mắc nào, vui lòng liên hệ với chúng tôi qua email.</p>
      
                  <p><strong>Liên hệ:</strong></p>
                  <p>Email: <a href="mailto:${
                    process.env.USER_MAIL
                  }" style="color: #f44336;">${process.env.USER_MAIL}</a></p>
                </td>
              </tr>
              <tr>
                <td style="background-color: #f7f7f7; padding: 10px; text-align: center; font-size: 0.9em; color: #555; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                  <p>Need further assistance? Contact us at <a href="mailto:${
                    process.env.USER_MAIL
                  }" style="color: #f44336;">${process.env.USER_MAIL}</a></p>
                  <p>&copy; 2024 AureoMall. All rights reserved.</p>
                </td>
              </tr>
            </table>
          </div>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("Failed to send email:", error);
        } else {
          console.log("Email sent successfully:", info.response);
        }
      });
    }
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const getPaymentById = async (paymentId) => {
  try {
    const payment = await Payment.findByPk(paymentId);

    if (!payment) {
      throw new Error("Payment not found");
    }

    return payment;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  CreatePayment,
  handleNotification,
  getPaymentById,
};
