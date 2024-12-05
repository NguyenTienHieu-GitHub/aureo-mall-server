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
module.exports = {
  calculateShippingFeeGHTK,
};
