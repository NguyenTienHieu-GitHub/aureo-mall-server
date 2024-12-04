const Shop = require("../../shop/models/ShopModel");
const ShopAddress = require("../../shop/models/ShopAddressModel");
const {
  AdministrativeRegion,
  AdministrativeUnit,
  Province,
  District,
  Ward,
} = require("../../user/models/UserAddressModel");
const sequelize = require("../../../config/db/index");

const createShop = async ({
  userId,
  shopName,
  description,
  provinceCode,
  districtCode,
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
    const shopAddress = await ShopAddress.create(
      {
        shopId: newShop.id,
        provinceCode,
        districtCode,
        wardCode,
        address,
        isPrimary,
      },
      { transaction }
    );
    const createdShop = await ShopAddress.findOne({
      where: { id: shopAddress.id },
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
      transaction,
    });
    await transaction.commit();
    return {
      shopName: newShop.name,
      description: newShop.description,
      email: newShop.email,
      phone: newShop.phone,
      logo: newShop.logo,
      website: newShop.website,
      provinceCode: createdShop.provinceCode,
      provinceName: createdShop.Province.name,
      districtCode: createdShop.districtCode,
      districtName: createdShop.District.name,
      wardCode: createdShop.wardCode,
      wardCode: createdShop.Ward.name,
      address: createdShop.address,
      isPrimary: createdShop.isPrimary,
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

module.exports = {
  createShop,
};
