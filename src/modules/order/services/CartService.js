const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const CartItemOption = require("../models/CartItemOptionModel");
const Product = require("../../product/models/ProductModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const sequelize = require("../../../config/db/index");

const getAllProductInCart = async (userId) => {
  try {
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          attributes: ["id", "quantity", "totalPrice"],
          include: [
            {
              model: CartItemOption,
              attributes: ["optionQuantity", "optionName", "optionValue"],
            },
            {
              model: Product,
              as: "Product",
              attributes: ["id", "productName", "sku"],
              include: [
                {
                  model: ProductPrice,
                  as: "ProductPrice",
                  attributes: ["finalPrice"],
                },
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      throw new Error("Cart not found for the given user.");
    }

    const totalQuantity = cart.CartItems.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalPrice = cart.CartItems.reduce(
      (sum, item) => sum + item.totalPrice,
      0
    );

    const response = {
      cartId: cart.id,
      userId: cart.userId,
      totalQuantity,
      totalPrice,
      items: (cart.CartItems || []).map((item) => ({
        productId: item.Product?.id || null,
        productName: item.Product?.productName || "Unknown",
        sku: item.Product?.sku || "Unknown",
        quantity: item.quantity,
        productPrice: item.Product?.ProductPrice?.finalPrice || 0,
        totalPrice: item.totalPrice,
        options: (item.CartItemOptions || []).map((option) => ({
          optionName: option.optionName || "Unknown",
          optionValue: option.optionValue || "Unknown",
          optionQuantity: option.optionQuantity || 0,
        })),
      })),
    };

    return response;
  } catch (error) {
    console.error("Error fetching products in cart:", error.message);
    throw new Error("Unable to fetch products in cart.");
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
      where: { cartId: cart.id, productId: productId },
    });
    const priceProduct = await ProductPrice.findOne({
      where: { productId: productId },
    });
    if (cartItem) {
      cartItem.quantity += quantity;
      cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
      await cartItem.save({ transaction });

      const existingOption = await CartItemOption.findOne({
        where: {
          cartItemId: cartItem.id,
          optionName: optionName,
          optionValue: optionValue,
        },
      });
      if (!existingOption) {
        await CartItemOption.create(
          {
            cartItemId: cartItem.id,
            optionQuantity: quantity,
            optionName,
            optionValue,
          },
          { transaction }
        );
      } else {
        await CartItemOption.update(
          {
            optionQuantity: quantity + existingOption.optionQuantity,
          },
          {
            where: {
              cartItemId: cartItem.id,
              optionName: optionName,
              optionValue: optionValue,
            },
            transaction,
          }
        );
      }
    } else {
      cartItem = await CartItem.create(
        {
          cartId: cart.id,
          productId: productId,
          quantity: quantity,
          totalPrice: quantity * priceProduct.finalPrice,
        },
        { transaction }
      );
      await CartItemOption.create(
        {
          cartItemId: cartItem.id,
          optionQuantity: quantity,
          optionName,
          optionValue,
        },
        { transaction }
      );
    }
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      attributes: ["quantity", "totalPrice"],
    });
    const totalQuantity = cartItems.reduce(
      (sum, item) => sum + (item.quantity || 0),
      0
    );
    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.totalPrice || 0),
      0
    );
    await Cart.update(
      { totalQuantity: totalQuantity, totalPrice: totalPrice },
      { where: { id: cart.id }, transaction }
    );
    await transaction.commit();
    return cart;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
module.exports = {
  getAllProductInCart,
  addProductToCart,
};
