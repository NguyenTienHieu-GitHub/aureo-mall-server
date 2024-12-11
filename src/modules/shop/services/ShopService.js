const Shop = require("../../shop/models/ShopModel");
const ShopAddress = require("../../shop/models/ShopAddressModel");
const {
  getProvinces,
  getDistrictsByProvinceID,
  getWardByDistrictID,
} = require("../../user/services/UserAddressService");
const sequelize = require("../../../config/db/index");
const axios = require("axios");

const createShop = async ({
  userId,
  shopName,
  description,
  provinceId,
  districtId,
  wardCode,
  address,
  isPrimary,
  phone,
  email,
  logo,
  website,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const findShop = await Shop.findOne({
      where: { shopName: shopName },
      transaction,
    });
    if (findShop) {
      throw new Error("Shop name already exists");
    }
    const newShop = await Shop.create(
      {
        userId,
        shopName,
        description,
        phone,
        email,
        logo,
        website,
      },
      { transaction }
    );
    const provinceNames = await getProvinces();
    const provinceName = provinceNames.find(
      (province) => province.ProvinceID === provinceId
    );
    const districtNames = await getDistrictsByProvinceID({ provinceId });
    const districtName = districtNames.find(
      (district) => district.DistrictID === districtId
    );
    const wardNames = await getWardByDistrictID(districtId);
    const wardName = wardNames.find((ward) => ward.WardCode === wardCode);

    const shopAddress = await ShopAddress.create(
      {
        shopId: newShop.id,
        provinceId,
        districtId,
        wardCode,
        address,
        fullAddress: `${address}, ${wardName.WardName}, ${districtName.DistrictName}, ${provinceName.ProvinceName}`,
        isPrimary,
      },
      { transaction }
    );
    const createShopGHN = await axios.post(
      `${process.env.GHN_API_URL}/v2/shop/register`,
      {
        district_id: districtId,
        ward_code: wardCode,
        name: newShop.shopName,
        phone: newShop.phone,
        address: shopAddress.fullAddress,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Token: process.env.GHN_API_KEY,
        },
      }
    );
    if (createShopGHN) {
      console.log("Create Shop GHN successfully");
    }
    const response = {
      shopId: newShop.id,
      shopIdGHN: createShopGHN.data.data.shop_id,
      shopName: newShop.shopName,
      description: newShop.description,
      phone: newShop.phone,
      email: newShop.email,
      logo: newShop.logo,
      website: newShop.website,
      fullAddress: shopAddress.fullAddress,
    };
    await transaction.commit();
    return response;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

module.exports = {
  createShop,
};
