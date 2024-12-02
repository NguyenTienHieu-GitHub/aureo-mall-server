const OrderService = require("../services/OrderService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const createOrder = async (req, res) => {
  const userId = req.user.id;
  const { addressId, note, items } = req.body;
  try {
    const order = await OrderService.createOrder(
      userId,
      addressId,
      note,
      items
    );
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Order created successfully",
      data: order,
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
  createOrder,
};
