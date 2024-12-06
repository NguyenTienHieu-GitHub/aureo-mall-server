const axios = require("axios");
const Shop = require("../../shop/models/ShopModel");
const ShopAddress = require("../../shop/models/ShopAddressModel");

const {
  UserAddress,
  AdministrativeRegion,
  AdministrativeUnit,
  Province,
  District,
  Ward,
} = require("../../user/models/UserAddressModel");
const calculateShippingFeeGHTK = async (
  pickProvince,
  pickDistrict,
  province,
  district,
  ward,
  address,
  weight,
  totalPrice
) => {
  try {
    const response = await axios.post(
      `${process.env.GHTK_API_URL}/shipment/fee`,
      {
        pick_province: pickProvince,
        pick_district: pickDistrict,
        province: province,
        district: district,
        ward: ward,
        address: address,
        weight: weight,
        value: totalPrice,
        transport: "road", // road or fly
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHTK_API_KEY,
        },
      }
    );
    if (response && response.data) {
      return response.data.fee.fee;
    } else {
      console.error("No data in the response");
      return null;
    }
  } catch (error) {
    if (error.response) {
      console.error("Error response:", error.response.data);
    } else if (error.request) {
      console.error("Error request:", error.request);
    } else {
      console.error("Error:", error.message);
    }
  }
};

const shippingFee = async (addressId, shopId, weight, totalPrice) => {
  const shopAddress = await Shop.findOne({
    where: { id: shopId },
    include: [
      {
        model: ShopAddress,
        attributes: ["provinceCode", "districtCode", "wardCode", "address"],
        include: [
          {
            model: Province,
            as: "Province",
            attributes: ["code", "name"],
          },
          {
            model: District,
            as: "District",
            attributes: ["code", "name"],
          },
          {
            model: Ward,
            as: "Ward",
            attributes: ["code", "name"],
          },
        ],
      },
    ],
  });
  const userAddress = await UserAddress.findByPk(addressId, {
    include: [
      {
        model: Province,
        as: "Province",
        attributes: ["code", "name"],
      },
      {
        model: District,
        as: "District",
        attributes: ["code", "name"],
      },
      {
        model: Ward,
        as: "Ward",
        attributes: ["code", "name"],
      },
    ],
  });
  const pickProvince = shopAddress.ShopAddresses[0].Province.name;
  const pickDistrict = shopAddress.ShopAddresses[0].District.name;
  const province = userAddress.Province.name;
  const district = userAddress.District.name;
  const ward = userAddress.Ward.name;
  const address = userAddress.address;
  const fee = await calculateShippingFeeGHTK(
    pickProvince,
    pickDistrict,
    province,
    district,
    ward,
    address,
    weight,
    totalPrice
  );
  return fee;
};
module.exports = {
  shippingFee,
};
