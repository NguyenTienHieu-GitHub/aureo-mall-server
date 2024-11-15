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
  const productId = req.params.productId;
  const { quantity, optionName, optionValue } = req.body;
  try {
    await CartService.addProductToCart({
      userId: userId,
      productId: productId,
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
module.exports = {
  getAllProductInCart,
  addProductToCart,
};
