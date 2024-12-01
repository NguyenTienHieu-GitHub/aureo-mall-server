const CheckoutService = require("../services/CheckoutService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const CreatePayment = async (req, res) => {
  const { orderId, paymentMethod } = req.body;
  try {
    const payment = await CheckoutService.CreatePayment(orderId, paymentMethod);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Payment created successfully",
      data: payment,
    });
  } catch (error) {
    if (error.message.includes("Đơn hàng đã được thanh toán hoặc hết hạn")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "ORDER_ALREADY_PROCESSED",
        errorMessage: "Đơn hàng đã được thanh toán hoặc hết hạn",
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
const handleNotification = async (req, res) => {
  const { orderId, resultCode, transId, amount, signature } = req.body;
  try {
    await CheckoutService.handleNotification({
      orderId: orderId,
      resultCode: resultCode,
      transId: transId,
      amount: amount,
      signature: signature,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Notification handled successfully",
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
const getPaymentById = async (req, res) => {
  const { paymentId } = req.params;
  try {
    const payment = await CheckoutService.getPaymentById(paymentId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Payment created successfully",
      data: payment,
    });
  } catch (error) {}
};
module.exports = {
  CreatePayment,
  handleNotification,
  getPaymentById,
};
