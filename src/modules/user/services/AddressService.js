const {
  Address,
  AdministrativeRegion,
  AdministrativeUnit,
  Province,
  District,
  Ward,
} = require("../models/AddressModel");

const getAllAddress = async () => {
  const allAddress = await Address.findAll({
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
  if (allAddress.length === 0) {
    throw new Error("Address not found");
  }
  const addresses = allAddress.map((allAddress) => {
    const addr = allAddress.toJSON();
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
const getMyAddress = async (userId) => {
  const myAddress = await Address.findAll({
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
  if (myAddress.length === 0) {
    throw new Error("Address not found");
  }
  const addressData = myAddress.map((myAddress) => {
    const address = myAddress.toJSON();
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
const getAddressById = async (addressId) => {
  const getAddressByIdResult = await Address.findOne({
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
  if (!getAddressByIdResult) {
    throw new Error("Address not found");
  }
  const addressesById = getAddressByIdResult.toJSON();

  return addressesById;
};

const createAddress = async ({
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
  const addAddressResult = await Address.create({
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
  const addressData = await Address.findOne({
    where: { id: addAddressResult.id },
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

const updateAddress = async ({
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
  const addressToUpdate = await Address.findOne({
    where: {
      id: addressId,
      userId: userId,
    },
  });
  if (!addressToUpdate) {
    throw new Error("Address not found");
  }
  await Address.update(
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
    {
      where: {
        id: addressId,
      },
    }
  );
  const addressData = await Address.findOne({
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
  });
  return addressData;
};

const deleteAddress = async ({ addressId, userId }) => {
  const addressToDelete = await Address.findOne({
    where: {
      id: addressId,
      userId: userId,
    },
  });
  if (!addressToDelete) {
    throw new Error("Address not found");
  }
  await Address.destroy({
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
  getAllAddress,
  getMyAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
  getProvinces,
  getDistricts,
  getWards,
  getAdministrativeRegion,
  getAdministrativeUnit,
  getDistrictsByProvinceCode,
  getWardByDistrictCode,
};
