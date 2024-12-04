const axios = require("axios");

const calculateShippingFeeGHTK = async (
  pickProvince,
  pickDistrict,
  province,
  district,
  address,
  weight,
  totalPrice,
  transport
) => {
  try {
    const response = await axios.post(
      `${process.env.GHTK_API_URL}/shipment/fee`,
      {
        pick_province: pickProvince,
        pick_district: pickDistrict,
        province: province,
        district: district,
        address: address,
        weight: weight,
        value: totalPrice,
        transport: transport,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHTK_API_KEY,
        },
      }
    );
    console.log("Shipping Fee:", response.data);
  } catch (error) {
    console.error("Error:", error.response.data);
  }
};

module.exports = {
  calculateShippingFeeGHTK,
};
