const Shop = require("../models/ShopModel");

const createShop = async ({
  userId,
  shopName,
  description,
  address,
  phone,
  email,
  logo,
  website,
}) => {
  const findShop = await Shop.findOne({ where: { shopName: shopName } });
  if (findShop) {
    throw new Error("Shop name already exists");
  }
  const newShop = await Shop.create({
    userId,
    shopName,
    description,
    address,
    phone,
    email,
    logo,
    website,
  });
  if (newShop === 0) {
    throw new Error("Create Shop failed");
  }
  return newShop;
};

module.exports = {
  createShop,
};
