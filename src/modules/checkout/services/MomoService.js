const axios = require("axios");
const crypto = require("crypto");

const momoConfig = {
  accessKey: process.env.MOMO_ACCESS_KEY,
  secretKey: process.env.MOMO_SECRET_KEY,
  partnerCode: process.env.MOMO_PARTNER_CODE,
  endpoint: process.env.MOMO_ENDPOINT,
};

const createMoMoPayment = async (
  orderId,
  amount,
  returnUrl,
  notifyUrl,
  totalQuantity
) => {
  const requestId = `${orderId}_${Date.now()}`;
  const orderInfo = `Thanh toán ${totalQuantity} sản phẩm`;
  const lang = "vi";
  const requestType = "payWithMethod";
  const autoCapture = true;
  const extraData = "";
  const orderGroupId = "";
  const orderIdMomo = `${orderId}_${Date.now()}`;

  const rawSignature = `accessKey=${momoConfig.accessKey}&amount=${amount}&extraData=${extraData}&ipnUrl=${notifyUrl}&orderId=${orderIdMomo}&orderInfo=${orderInfo}&partnerCode=${momoConfig.partnerCode}&redirectUrl=${returnUrl}&requestId=${requestId}&requestType=${requestType}`;
  const signature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");
  const requestBody = JSON.stringify({
    partnerCode: momoConfig.partnerCode,
    partnerName: "Test",
    storeId: "MomoTestStore",
    requestId: requestId,
    amount: amount,
    orderId: orderIdMomo,
    orderInfo: orderInfo,
    redirectUrl: returnUrl,
    ipnUrl: notifyUrl,
    lang: lang,
    requestType: requestType,
    autoCapture: autoCapture,
    extraData: extraData,
    orderGroupId: orderGroupId,
    signature: signature,
  });

  const options = {
    method: "POST",
    url: `${momoConfig.endpoint}`,
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(requestBody),
    },
    data: requestBody,
  };
  let result;
  try {
    result = await axios(options);
    if (result.data.resultCode !== 0) {
      console.error("MoMo error:", result.data);
      throw new Error(`MoMo API Error: ${result.data.message}`);
    }
    return result.data;
  } catch (error) {
    console.error(
      "Request to MoMo failed:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create payment");
  }
};

const verifyMoMoSignature = (data) => {
  const { signature, ...rest } = data;

  const rawSignature = Object.keys(rest)
    .sort()
    .map((key) => `${key}=${rest[key]}`)
    .join("&");

  const calculatedSignature = crypto
    .createHmac("sha256", momoConfig.secretKey)
    .update(rawSignature)
    .digest("hex");

  return {
    isValid: calculatedSignature === signature,
    data: { ...rest, signature },
  };
};

module.exports = { createMoMoPayment, verifyMoMoSignature };
