const Order = require("../models/OrderModel");
const OrderDetail = require("../models/OrderDetailModel");
const Product = require("../../product/models/ProductModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const Shop = require("../../shop/models/ShopModel");
const CartItem = require("../../cart/models/CartItemModel");
const sequelize = require("../../../config/db/index");
const { shippingFee } = require("../../shipping/services/ShippingService");

const createOrder = async (userId, addressId, note, cartItemIds) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItems = await CartItem.findAll(
      {
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
      },
      { transaction }
    );
    const itemsByShop = cartItems.reduce((acc, item) => {
      const shopId = item.Product.Shop.id;
      const weight = item.quantity * item.Product.weight;
      const price = item.quantity * item.Product.ProductPrice.finalPrice;
      const quantity = item.quantity;
      if (!acc[shopId]) {
        acc[shopId] = {
          totalWeight: 0,
          totalPrice: 0,
          totalQuantity: 0,
          items: [],
        };
      }

      acc[shopId].totalWeight += weight;
      acc[shopId].totalPrice += price;
      acc[shopId].totalQuantity += quantity;
      acc[shopId].items.push(item);

      return acc;
    }, {});

    const orders = [];

    for (const [
      shopIdStr,
      { totalWeight, totalPrice, totalQuantity, items },
    ] of Object.entries(itemsByShop)) {
      const shopId = Number(shopIdStr);
      const fee = await shippingFee(addressId, shopId, totalWeight, totalPrice);
      const order = await Order.create(
        {
          shopId,
          userId,
          addressId,
          shippingFee: fee,
          totalQuantity,
          totalPrice: totalPrice + fee,
          status: "Pending",
          note,
        },
        { transaction }
      );

      await Promise.all(
        items.map(async (item) => {
          await OrderDetail.create(
            {
              orderId: order.id,
              productId: item.Product.id,
              optionName: item.optionName,
              optionValue: item.optionValue,
              quantity: item.quantity,
              unitPrice: item.Product.ProductPrice.finalPrice,
              subtotal: item.quantity * item.Product.ProductPrice.finalPrice,
            },
            { transaction }
          );

          await Product.increment("soldCount", {
            by: item.quantity,
            where: { id: item.Product.id },
            transaction,
          });
        })
      );

      orders.push(order);
    }
    await transaction.commit();
    return orders;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

module.exports = {
  createOrder,
};
