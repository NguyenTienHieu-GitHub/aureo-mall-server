const Cart = require("../models/CartModel");
const CartItem = require("../models/CartItemModel");
const CartItemOption = require("../models/CartItemOptionModel");
const Product = require("../../product/models/ProductModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const sequelize = require("../../../config/db/index");

const updateCartTotalPrice = async ({ cart }) => {
  if (!cart) {
    console.error("Cart not found.");
    return;
  }
  const cartItems = cart.CartItems;
  if (!cartItems || cartItems.length === 0) {
    return;
  }
  let totalCartPrice = 0;
  for (let cartItem of cartItems) {
    const finalPrice =
      cartItem.Product?.ProductPrice?.finalPrice ||
      cartItem.Product?.originalPrice;
    if (finalPrice === undefined || finalPrice === null) {
      console.error(
        `Final price is missing for Product ID: ${cartItem.Product?.id}`
      );
      continue;
    }
    cartItem.totalPrice = finalPrice * cartItem.quantity;
    await cartItem.save();
    totalCartPrice += cartItem.totalPrice;
  }
  const cartId = cart.id;
  const cartData = await Cart.findByPk(cartId);
  if (!cartData) {
    console.error("Cart not found for the provided cartId.");
    return;
  }
  cartData.totalPrice = totalCartPrice;
  await cartData.save();
};

const getAllProductInCart = async (userId) => {
  try {
    await createCartIfNotExist({ userId });
    const cart = await Cart.findOne({
      where: { userId },
      include: [
        {
          model: CartItem,
          attributes: ["id", "quantity", "totalPrice"],
          include: [
            {
              model: CartItemOption,
              attributes: ["id", "optionQuantity", "optionName", "optionValue"],
            },
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
              ],
            },
          ],
        },
      ],
    });

    if (!cart) {
      throw new Error("Cart not found for the given user");
    }
    await updateCartTotalPrice({ cart });
    const total = await Cart.findByPk(cart.id);
    const response = {
      cartId: cart.id,
      userId: cart.userId,
      totalQuantity: total.totalQuantity,
      totalPrice: total.totalPrice,
      items:
        cart.CartItems && cart.CartItems.length > 0
          ? cart.CartItems.map((item) => ({
              productId: item.Product?.id || null,
              productName: item.Product?.productName || "Unknown",
              sku: item.Product?.sku || "Unknown",
              totalQuantity: item.quantity,
              productPrice: item.Product?.ProductPrice?.finalPrice,
              totalPrice: item.totalPrice,
              options: (item.CartItemOptions || []).map((option) => ({
                cartItemOptionId: option.id,
                optionName: option.optionName || "Unknown",
                optionValue: option.optionValue || "Unknown",
                optionQuantity: option.optionQuantity || 0,
              })),
            }))
          : "Cart is empty",
    };

    return response;
  } catch (error) {
    console.error("Error fetching products in cart:", error.message);
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
      where: { cartId: cart.id, productId },
      include: [
        {
          model: CartItemOption,
          where: { optionName, optionValue },
          required: false,
        },
      ],
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
      if (optionName && optionValue) {
        const existingOption = cartItem.CartItemOptions?.[0];
        if (existingOption) {
          existingOption.optionQuantity += quantity;
          await existingOption.save({ transaction });
        } else {
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
      if (optionName && optionValue) {
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
    }
    let totalPrice = 0;
    let totalQuantity = 0;
    const total = await CartItem.findAll({
      where: { cartId: cart.id },
      attributes: ["quantity", "totalPrice"],
      transaction,
    });
    if (total.length === 0) {
      console.log("No CartItem found for this cart.");
    }
    for (const item of total) {
      totalQuantity += item.quantity || 0;
      totalPrice += item.totalPrice || 0;
    }
    await Cart.update(
      { totalQuantity, totalPrice },
      { where: { id: cart.id }, transaction }
    );
    await transaction.commit();
    return cart;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const updateItemInCart = async ({
  cartId,
  productId,
  cartItemOptionId,
  quantity,
  optionName,
  optionValue,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const cartItemOption = await CartItemOption.findByPk(cartItemOptionId, {
      transaction,
    });
    if (!cartItemOption) {
      throw new Error("CartItemOption not found");
    }
    cartItemOption.optionQuantity = quantity;
    cartItemOption.optionName = optionName;
    cartItemOption.optionValue = optionValue;
    await cartItemOption.save({ transaction });
    const cartItem = await CartItem.findOne({
      where: { cartId, productId },
      transaction,
    });
    const cartOptions = await CartItemOption.findAll({
      where: { cartItemId: cartItem.id },
      transaction,
    });

    let optionQuantity = cartOptions.reduce(
      (sum, item) => sum + item.optionQuantity,
      0
    );
    cartItem.quantity = optionQuantity;

    const priceProduct = await ProductPrice.findOne({
      where: { productId },
      transaction,
    });
    cartItem.totalPrice = cartItem.quantity * priceProduct.finalPrice;
    await cartItem.save({ transaction });

    const cartItems = await CartItem.findAll({
      where: { cartId },
      attributes: ["quantity", "totalPrice"],
      transaction,
    });
    let totalPrice = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    let totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    await Cart.update(
      { totalQuantity, totalPrice },
      { where: { id: cartId }, transaction }
    );
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
module.exports = {
  getAllProductInCart,
  addProductToCart,
  updateItemInCart,
};
