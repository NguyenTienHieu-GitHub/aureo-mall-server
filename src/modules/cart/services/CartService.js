const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const Product = require("../../product/models/ProductModel");
const Shop = require("../../product/models/ShopModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const sequelize = require("../../../config/db/index");

const getAllProductInCart = async (userId) => {
  try {
    await createCartIfNotExist({ userId });
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          attributes: [
            "id",
            "quantity",
            "optionName",
            "optionValue",
            "totalPrice",
          ],
          include: [
            {
              model: Product,
              as: "Product",
              attributes: ["id", "productName", "sku"],
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
      ],
    });

    if (!cart) {
      throw new Error("Cart not found for the given user");
    }
    const groupedItemsByShop = cart.CartItems.reduce((result, item) => {
      const shopId = item.Product.Shop?.id || "Unknown";
      const shopName = item.Product.Shop?.shopName || "Unknown";

      if (!result[shopId]) {
        result[shopId] = {
          shopId,
          shopName,
          products: [],
        };
      }

      result[shopId].products.push({
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

      return result;
    }, {});
    const response = {
      cartId: cart.id,
      userId: cart.userId,
      shops:
        Object.values(groupedItemsByShop).length > 0
          ? Object.values(groupedItemsByShop)
          : "Cart is empty",
    };

    return response;
  } catch (error) {
    console.error("Error fetching products in cart:", error.message);
    throw new Error(error.message);
  }
};
const getAllSelected = async (cartItemIds) => {
  try {
    const cartItems = await CartItem.findAll({
      where: { id: cartItemIds },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["id", "productName", "sku"],
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
    const groupedItemsByShop = cartItems.reduce((result, item) => {
      const shopId = item.Product.Shop?.id || "Unknown";
      const shopName = item.Product.Shop?.shopName || "Unknown";

      if (!result[shopId]) {
        result[shopId] = {
          shopId,
          shopName,
          products: [],
          totalQuantity: 0,
          totalPrice: 0,
        };
      }
      result[shopId].totalPrice += item.totalPrice;
      result[shopId].totalQuantity += item.quantity;
      result[shopId].products.push({
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

      return result;
    }, {});
    const response = Object.values(groupedItemsByShop);

    return response;
  } catch (error) {
    throw new Error(error.message);
  }
};
const createCartIfNotExist = async ({ userId }) => {
  try {
    const cart = await Cart.findOne({
      where: { userId: userId },
    });

    if (!cart) {
      const newCart = await Cart.create({
        userId: userId,
        totalQuantity: 0,
        totalPrice: 0,
      });
      return newCart;
    }

    return cart;
  } catch (error) {
    throw new Error(error.message);
  }
};
const addProductToCart = async ({
  userId,
  productId,
  quantity,
  optionName,
  optionValue,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const cart = await createCartIfNotExist({ userId });
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId, optionName, optionValue },
    });
    const priceProduct = await ProductPrice.findOne({
      where: { productId },
      attributes: [
        "originalPrice",
        "discountPrice",
        "discountType",
        "discountStartDate",
        "discountEndDate",
      ],
    });
    if (!priceProduct) throw new Error("Product price not found");
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
      await cartItem.save({ transaction });
    } else {
      cartItem = await CartItem.create(
        {
          cartId: cart.id,
          productId: productId,
          optionName: optionName,
          optionValue: optionValue,
          quantity: quantity,
          totalPrice: quantity * priceProduct.finalPrice,
        },
        { transaction }
      );
    }
    await transaction.commit();
    return cart;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const updateItemInCart = async ({
  cartItemId,
  productId,
  quantity,
  optionName,
  optionValue,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItem = await CartItem.findByPk(cartItemId, { transaction });
    cartItem.quantity = quantity;
    cartItem.optionName = optionName;
    cartItem.optionValue = optionValue;
    const priceProduct = await ProductPrice.findOne({
      where: { productId },
      transaction,
    });
    cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
    await cartItem.save({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const deleteItemInCart = async ({ cartItemId }) => {
  const transaction = await sequelize.transaction();
  try {
    console.log(cartItemId);
    const cartItem = await CartItem.findByPk(cartItemId, { transaction });
    if (!cartItem) {
      throw new Error("CartItem not found");
    }
    await cartItem.destroy({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const deleteAllSelected = async (cartItemIds) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItems = await CartItem.findAll({ where: { id: cartItemIds } });
    for (const cartItem of cartItems) {
      await cartItem.destroy({ transaction });
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
module.exports = {
  getAllProductInCart,
  getAllSelected,
  addProductToCart,
  updateItemInCart,
  deleteItemInCart,
  deleteAllSelected,
};
