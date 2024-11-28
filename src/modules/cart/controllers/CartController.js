const CartService = require("../services/CartService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllProductInCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cartData = await CartService.getAllProductInCart(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all products in cart",
      data: cartData,
    });
  } catch (error) {
    if (error.message.includes("Cart not found for the given user")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CART_NOT_FOUND",
        errorMessage: "Cart not found for the given user",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const getAllSelected = async (req, res) => {
  const { cartItemIds } = req.body;
  if (!Array.isArray(cartItemIds) || cartItemIds.length === 0) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "BAD_REQUEST",
      errorMessage: "cartItemIds must be a non-empty array.",
    });
  }
  try {
    const cartItems = await CartService.getAllSelected(cartItemIds);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show item selected successfully",
      data: cartItems,
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};
const addProductToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity, optionName, optionValue } = req.body;
  try {
    await CartService.addProductToCart({
      userId: userId,
      productId,
      quantity,
      optionName,
      optionValue,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Add product to cart successfully",
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};
const updateItemInCart = async (req, res) => {
  const { cartItemId } = req.params;
  const { productId, quantity, optionName, optionValue } = req.body;
  try {
    const cartData = await CartService.updateItemInCart({
      cartItemId,
      productId,
      quantity,
      optionName,
      optionValue,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Updated cart item successfully",
      data: cartData,
    });
  } catch (error) {
    if (error.message.includes("CartItemOption not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CART_OPTION_NOT_FOUND",
        errorMessage: "CartItemOption not found",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const deleteItemInCart = async (req, res) => {
  const { cartItemId } = req.params;
  try {
    await CartService.deleteItemInCart({ cartItemId });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Deleted cart item successfully",
    });
  } catch (error) {
    if (error.message === "CartItemOption not found") {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CART_ITEM_OPTION_NOT_FOUND",
        errorMessage: "The cart item option does not exist",
      });
    } else if (error.message === "CartItem not found") {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CART_ITEM_NOT_FOUND",
        errorMessage: "The cart item does not exist",
      });
    } else if (error.message === "Product price not found") {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "PRODUCT_PRICE_NOT_FOUND",
        errorMessage: "The price for the product could not be found",
      });
    }
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};
const deleteAllSelected = async (req, res) => {
  const { cartItemIds } = req.body;
  try {
    await CartService.deleteAllSelected(cartItemIds);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Deleted item selected successfully",
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
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
