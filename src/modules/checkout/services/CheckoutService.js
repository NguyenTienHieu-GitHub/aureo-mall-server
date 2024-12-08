const Payment = require("../models/paymentModel");
const Order = require("../../order/models/OrderModel");
const OrderPayment = require("../models/OrderPaymentModel");
const Shop = require("../../shop/models/ShopModel");
const ShopAddress = require("../../shop/models/ShopAddressModel");
const User = require("../../auth/models/UserModel");
const Product = require("../../product/models/ProductModel");
const Cart = require("../../cart/models/CartModel");
const CartItem = require("../../cart/models/CartItemModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const { shippingFee } = require("../../shipping/services/ShippingService");
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
  const randomPart = Math.floor(Math.random() * 900000) + 100000;
  const transId = `${timestamp.toString().slice(-6)}${randomPart}`;
  return transId.slice(0, 10);
};

const CreatePayment = async (orderIds, paymentMethod) => {
  const transaction = await sequelize.transaction();
  try {
    if (!orderIds || !paymentMethod) {
      throw new Error("Missing required fields");
    }
    const orders = await Order.findAll({ where: { id: orderIds } });
    if (!orders || orders.length === 0) {
      throw new Error("No orders found");
    }
    const existingPayment = await OrderPayment.findAll({
      where: { orderId: orderIds },
    });

    let payment;
    if (existingPayment.length === 0) {
      payment = await createNewPayment(orders, paymentMethod, transaction);
    } else {
      const paymentIds = existingPayment.map((item) => item.paymentId);
      payment = await Payment.findOne({ where: { id: paymentIds[0] } });

      if (!payment) {
        throw new Error("No payment found for the orders");
      }

      if (payment.status === "Pending" && paymentMethod === "MoMo") {
        return await handleMoMoPayment(payment, orders);
      }

      if (payment.status === "Completed") {
        throw new Error("Payment already completed");
      }
    }

    await transaction.commit();
    if (paymentMethod === "MoMo") {
      return await handleMoMoPayment(payment, orders);
    }
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

const createNewPayment = async (orders, paymentMethod, transaction) => {
  const transId = generateTransId();
  const totalAmount = orders.reduce((sum, order) => sum + order.totalPrice, 0);

  const payment = await Payment.create(
    {
      userId: orders[0].userId,
      paymentMethod,
      status: "Pending",
      transactionId: transId,
      totalAmount,
    },
    { transaction }
  );

  for (const order of orders) {
    await OrderPayment.create(
      {
        paymentId: payment.id,
        orderId: order.id,
        amount: order.totalPrice,
      },
      { transaction }
    );
  }

  return payment;
};

const handleMoMoPayment = async (payment, orders) => {
  const ngrokUrl = await startNgrok();
  const returnUrl = process.env.MOMO_REDIRECT_URL;
  const notifyUrl = `${ngrokUrl}/api/checkout/notify`;

  const totalQuantity = orders.reduce(
    (sum, order) => sum + order.totalQuantity,
    0
  );
  const momoResponse = await createMoMoPayment(
    payment.id,
    payment.totalAmount,
    returnUrl,
    notifyUrl,
    totalQuantity
  );

  return { payUrl: momoResponse.payUrl };
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
    const orders = await OrderPayment.findAll({
      where: { paymentId: payment.id },
    });
    for (const order of orders) {
      const findOrder = await Order.findOne({
        where: { id: order.orderId },
        transaction,
      });
      if (findOrder) {
        switch (resultCode) {
          case 0:
            findOrder.status = "Paid";
            break;
          case 1:
            findOrder.status = "Failed";
            break;
          case 2:
            findOrder.status = "Refunded";
            break;
          case 3:
            findOrder.status = "Expired";
            break;
          default:
            findOrder.status = "Pending";
        }
      }
      await findOrder.save({ transaction });
      if (findOrder.status === "Paid") {
        const shop = await Shop.findOne({
          where: { id: findOrder.shopId },
        });
        const address = await UserAddress.findOne({
          where: { id: findOrder.addressId },
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
          where: { orderId: findOrder.id },
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
      if (findOrder.status === "Failed") {
        const user = await User.findOne({
          where: { id: findOrder.userId },
        });
        const address = await UserAddress.findOne({
          where: { id: findOrder.addressId },
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
          where: { orderId: findOrder.id },
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
    }
    await transaction.commit();
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

const getAllSelected = async (userId, cartItemIds, addressId) => {
  try {
    if (addressId === "" || addressId === null) {
      const userAddress = await UserAddress.findOne({
        where: { userId: userId, isPrimary: true },
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
      if (!userAddress) {
        throw new Error("No primary address found for the user.");
      }
      addressId = userAddress.id;
    }
    const cartItems = await CartItem.findAll({
      where: { id: cartItemIds },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["id", "productName", "sku", "weight"],
          include: [
            {
              model: ProductPrice,
              as: "ProductPrice",
              attributes: [
                "originalPrice",
                "discountPrice",
                "discountType",
                "discountStartDate",
                "discountEndDate",
                "finalPrice",
              ],
            },
            {
              model: Shop,
              as: "Shop",
              attributes: ["id", "shopName"],
            },
          ],
        },
      ],
    });
    if (cartItems.length === 0) {
      throw new Error("No cart items found for the provided IDs.");
    }
    const groupedItemsByShop = {};
    for (const item of cartItems) {
      const shopId = item.Product.Shop?.id || "Unknown";
      const shopName = item.Product.Shop?.shopName || "Unknown";
      const weight = item.Product.weight;

      if (!groupedItemsByShop[shopId]) {
        groupedItemsByShop[shopId] = {
          shopId,
          shopName,
          products: [],
          totalProductPrice: 0,
          shippingFee: 0,
          totalQuantity: 0,
          totalAmountToPay: 0,
        };
      }
      const shipping = await shippingFee(
        addressId,
        shopId,
        weight,
        groupedItemsByShop[shopId].totalPrice
      );
      groupedItemsByShop[shopId].shippingFee = shipping;
      groupedItemsByShop[shopId].totalProductPrice += item.totalPrice +=
        shipping;
      groupedItemsByShop[shopId].totalQuantity += item.quantity;
      groupedItemsByShop[shopId].totalAmountToPay =
        groupedItemsByShop[shopId].shippingFee +
        groupedItemsByShop[shopId].totalProductPrice;
      groupedItemsByShop[shopId].products.push({
        cartItemId: item.id,
        productId: item.Product?.id || null,
        productName: item.Product?.productName,
        optionName: item.optionName,
        optionValue: item.optionValue,
        originalPrice: item.Product?.ProductPrice?.originalPrice,
        finalPrice:
          item.Product?.ProductPrice?.originalPrice ===
          item.Product?.ProductPrice?.finalPrice
            ? null
            : item.Product?.ProductPrice?.finalPrice,
        quantity: item.quantity,
        totalPrice: item.totalPrice,
      });
    }
    const response = Object.values(groupedItemsByShop);

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  CreatePayment,
  getAllSelected,
  handleNotification,
  getPaymentById,
};
