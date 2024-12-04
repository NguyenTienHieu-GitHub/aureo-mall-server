const Order = require("../models/OrderModel");
const OrderDetail = require("../models/OrderDetailModel");
const Product = require("../../product/models/ProductModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const Shop = require("../../shop/models/ShopModel");
const sequelize = require("../../../config/db/index");
const createOrder = async (userId, addressId, note, items) => {
  const transaction = await sequelize.transaction();
  try {
    const itemsByShop = items.reduce((acc, item) => {
      const shopId = item.shopId;
      if (!acc[shopId]) {
        acc[shopId] = [];
      }
      acc[shopId].push(item);
      return acc;
    }, {});
    const orders = [];
    for (const [shopId, shopItems] of Object.entries(itemsByShop)) {
      let totalPrice = 0;
      let totalQuantity = 0;
      const productIds = shopItems.map((item) => item.productId);
      const products = await Product.findAll({
        where: { id: productIds },
        attributes: ["id", "productName"],
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
      });
      const productPriceMap = {};
      products.forEach((product) => {
        if (product.ProductPrice) {
          productPriceMap[product.id] = product.ProductPrice.finalPrice;
        }
      });

      shopItems.forEach((item) => {
        const priceInDb = productPriceMap[item.productId];
        if (!priceInDb) {
          throw new Error(`Price not found for product ID ${item.productId}`);
        }
        if (item.unitPrice !== priceInDb) {
          throw new Error(
            `Price mismatch for product ID ${item.productId}: expected ${priceInDb}, received ${item.unitPrice}.`
          );
        }
        item.unitPrice = priceInDb;
        item.subtotal = item.quantity * priceInDb;
        totalQuantity += item.quantity;
        totalPrice += item.subtotal;
      });
      const order = await Order.create(
        {
          userId,
          shopId,
          addressId,
          totalQuantity,
          totalPrice,
          status: "Pending",
          note,
        },
        { transaction }
      );
      orders.push(order);
      const orderDetails = shopItems.map((item) => ({
        orderId: order.id,
        productId: item.productId,
        optionName: item.optionName,
        optionValue: item.optionValue,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal,
      }));

      await OrderDetail.bulkCreate(orderDetails, { transaction });
      const response = {
        orderId: order.id,
      };
      return response;
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
module.exports = {
  createOrder,
};
