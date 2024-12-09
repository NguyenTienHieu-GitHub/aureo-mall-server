const axios = require("axios");
const Shop = require("../../shop/models/ShopModel");
const ShopAddress = require("../../shop/models/ShopAddressModel");
const {
  getProvinces,
  getDistrictsByProvinceID,
  getWardByDistrictID,
} = require("../../user/services/UserAddressService");
const UserAddress = require("../../user/models/UserAddressModel");
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
        attributes: ["provinceId", "districtId", "wardCode", "address"],
      },
    ],
  });
  const userAddress = await UserAddress.findByPk(addressId);
  const provinceShop = shopAddress.ShopAddresses[0].provinceId;
  const districtShop = shopAddress.ShopAddresses[0].districtId;
  const provinceUser = userAddress.provinceId;
  const districtUser = userAddress.districtId;
  const wardUser = userAddress.wardCode;
  const addressUser = userAddress.address;

  const provinceNames = await getProvinces();
  const pickProvince = provinceNames.find(
    (province) => province.ProvinceID === provinceShop
  );
  const province = provinceNames.find(
    (province) => province.ProvinceID === provinceUser
  );
  const districtNames = await getDistrictsByProvinceID({ provinceShop });
  const pickDistrict = districtNames.find(
    (district) => district.DistrictID === districtShop
  );
  const district = districtNames.find(
    (district) => district.DistrictID === districtUser
  );
  const wardNames = await getWardByDistrictID(districtUser);
  const wardName = wardNames.find((ward) => ward.WardCode === wardUser);
  const fee = await calculateShippingFeeGHTK(
    pickProvince.ProvinceName,
    pickDistrict.DistrictName,
    province.ProvinceName,
    district.DistrictName,
    wardName.WardName,
    addressUser,
    weight,
    totalPrice
  );
  return fee;
};
module.exports = {
  shippingFee,
};
