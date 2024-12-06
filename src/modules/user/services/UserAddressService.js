const {
  UserAddress,
  AdministrativeRegion,
  AdministrativeUnit,
  Province,
  District,
  Ward,
} = require("../models/UserAddressModel");

const sequelize = require("../../../config/db/index");
const getAllUserAddress = async () => {
  const allUserAddress = await UserAddress.findAll({
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
  if (allUserAddress.length === 0) {
    throw new Error("UserAddress not found");
  }
  const addresses = allUserAddress.map((allUserAddress) => {
    const addr = allUserAddress.toJSON();
    return {
      addressId: addr.id,
      userId: addr.userId,
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      provinceCode: addr.provinceCode,
      provinceName: addr.Province.name,
      districtCode: addr.districtCode,
      districtName: addr.District.name,
      wardCode: addr.wardCode,
      wardName: addr.Ward.name,
      address: addr.address,
      addressType: addr.addressType,
      isPrimary: addr.isPrimary,
    };
  });
  return addresses;
};
const getMyUserAddress = async (userId) => {
  const myUserAddress = await UserAddress.findAll({
    where: { userId: userId },
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
  if (myUserAddress.length === 0) {
    throw new Error("UserAddress not found");
  }
  const addressData = myUserAddress.map((myUserAddress) => {
    const address = myUserAddress.toJSON();
    return {
      addressId: address.id,
      fullName: address.fullName,
      phoneNumber: address.phoneNumber,
      provinceCode: address.provinceCode,
      provinceName: address.Province.name,
      districtCode: address.districtCode,
      districtName: address.District.name,
      wardCode: address.wardCode,
      wardName: address.Ward.name,
      address: address.address,
      addressType: address.addressType,
      isPrimary: address.isPrimary,
    };
  });
  return addressData;
};
const getUserAddressById = async (addressId) => {
  const getUserAddressByIdResult = await UserAddress.findOne({
    where: { id: addressId },
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
  if (!getUserAddressByIdResult) {
    throw new Error("UserAddress not found");
  }
  const addressesById = getUserAddressByIdResult.toJSON();

  return addressesById;
};

const createUserAddress = async ({
  userId,
  fullName,
  phoneNumber,
  provinceCode,
  districtCode,
  wardCode,
  address,
  addressType,
  isPrimary,
}) => {
  if (isPrimary === true) {
    await UserAddress.update(
      { isPrimary: false },
      {
        where: { userId, isPrimary: true },
      }
    );
  }
  const addUserAddressResult = await UserAddress.create({
    userId: userId,
    fullName: fullName,
    phoneNumber: phoneNumber,
    provinceCode: provinceCode,
    districtCode: districtCode,
    wardCode: wardCode,
    address: address,
    addressType: addressType,
    isPrimary: isPrimary,
  });
  const addressData = await UserAddress.findOne({
    where: { id: addUserAddressResult.id },
    include: [
      {
        model: Province,
        as: "Province",
        attributes: ["name"],
      },
      {
        model: District,
        as: "District",
        attributes: ["name"],
      },
      {
        model: Ward,
        as: "Ward",
        attributes: ["name"],
      },
    ],
  });
  return addressData;
};

const updateUserAddress = async ({
  userId,
  addressId,
  fullName,
  phoneNumber,
  provinceCode,
  districtCode,
  wardCode,
  address,
  addressType,
  isPrimary,
}) => {
  const transaction = await sequelize.transaction();
  try {
    if (isPrimary === true) {
      await UserAddress.update(
        { isPrimary: false },
        {
          where: { userId, isPrimary: true },
          transaction,
        }
      );
    }

    const currentAddress = await UserAddress.findOne({
      where: { id: addressId, userId },
      transaction,
    });

    if (!currentAddress) {
      throw new Error("Address not found");
    }
    if (currentAddress.isPrimary) {
      isPrimary = currentAddress.isPrimary;
    }
    await currentAddress.update(
      {
        fullName,
        phoneNumber,
        provinceCode,
        districtCode,
        wardCode,
        address,
        addressType,
        isPrimary,
      },
      { transaction }
    );

    const addressData = await UserAddress.findOne({
      where: { id: addressId },
      include: [
        {
          model: Province,
          as: "Province",
          attributes: ["name"],
        },
        {
          model: District,
          as: "District",
          attributes: ["name"],
        },
        {
          model: Ward,
          as: "Ward",
          attributes: ["name"],
        },
      ],
      transaction,
    });
    await transaction.commit();
    return addressData;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};

const deleteUserAddress = async ({ addressId, userId }) => {
  const addressToDelete = await UserAddress.findOne({
    where: {
      id: addressId,
      userId: userId,
    },
  });
  if (!addressToDelete) {
    throw new Error("UserAddress not found");
  }
  if (addressToDelete.isPrimary === true) {
    throw new Error("Cannot delete the primary address");
  }
  await UserAddress.destroy({
    where: {
      id: addressId,
    },
  });
};

const getProvinces = async () => {
  const provinces = await Province.findAll();
  if (provinces.length === 0) {
    throw new Error("Provinces not found");
  }
  const provincesData = provinces.map((province) => ({
    code: province.code,
    name: province.name,
  }));
  return provincesData;
};
const getDistricts = async () => {
  const districts = await District.findAll();
  if (districts.length === 0) {
    throw new Error("Districts not found");
  }
  const districtsData = districts.map((district) => ({
    code: district.code,
    name: district.name,
  }));
  return districtsData;
};
const getWards = async () => {
  const wards = await Ward.findAll();
  if (wards.length === 0) {
    throw new Error("Wards not found");
  }
  const wardsData = wards.map((ward) => ({
    code: ward.code,
    name: ward.name,
  }));
  return wardsData;
};
const getAdministrativeRegion = async () => {
  const administrativeRegions = await AdministrativeRegion.findAll();
  if (administrativeRegions.length === 0) {
    throw new Error("Administrative regions not found");
  }
  return administrativeRegions;
};
const getAdministrativeUnit = async () => {
  const administrativeUnits = await AdministrativeUnit.findAll();
  if (administrativeUnits.length === 0) {
    throw new Error("Administrative units not found");
  }
  return administrativeUnits;
};
const getDistrictsByProvinceCode = async (provinceCode) => {
  const districtByProvinceCode = await Province.findOne({
    where: { code: provinceCode },
    include: [
      { model: District, attributes: ["code", "name", "provinceCode"] },
    ],
  });
  if (!districtByProvinceCode) {
    throw new Error("Province not found");
  }
  const districts = districtByProvinceCode.Districts;
  return districts.map((district) => ({
    code: district.code,
    name: district.name,
    provinceCode: district.provinceCode,
  }));
};
const getWardByDistrictCode = async (districtCode) => {
  const wardByDistrictCode = await District.findOne({
    where: { code: districtCode },
    include: [
      {
        model: Ward,
        attributes: ["code", "name", "districtCode"],
      },
    ],
  });
  if (!wardByDistrictCode) {
    throw new Error("District not found");
  }
  const wards = wardByDistrictCode.Wards;
  return wards.map((ward) => ({
    code: ward.code,
    name: ward.name,
    districtCode: ward.districtCode,
  }));
};
module.exports = {
  getAllUserAddress,
  getMyUserAddress,
  getUserAddressById,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
  getProvinces,
  getDistricts,
  getWards,
  getAdministrativeRegion,
  getAdministrativeUnit,
  getDistrictsByProvinceCode,
  getWardByDistrictCode,
};
