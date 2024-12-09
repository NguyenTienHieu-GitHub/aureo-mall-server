const UserAddress = require("../models/UserAddressModel");
const axios = require("axios");
const sequelize = require("../../../config/db/index");

const getProvinces = async () => {
  const response = await axios.get(
    `${process.env.GHN_API_URL}/master-data/province`,
    {
      headers: {
        "Content-Type": "application/json",
        Token: process.env.GHN_API_KEY,
      },
    }
  );
  const provinces = response.data.data;
  const province = provinces.map((province) => ({
    ProvinceID: province.ProvinceID,
    ProvinceName: province.ProvinceName,
  }));
  return province;
};
const getDistrictsByProvinceID = async ({ provinceId }) => {
  try {
    const response = await axios.get(
      `${process.env.GHN_API_URL}/master-data/district`,
      {
        headers: {
          "Content-Type": "application/json",
          token: process.env.GHN_API_KEY,
        },
        params: {
          province_id: provinceId,
        },
      }
    );
    const districts = response.data.data;
    const district = districts.map((district) => ({
      DistrictID: district.DistrictID,
      DistrictName: district.DistrictName,
      ProvinceID: district.ProvinceID,
    }));
    return district;
  } catch (error) {
    throw new Error(error.message);
  }
};
const getWardByDistrictID = async (districtId) => {
  const response = await axios.get(
    `${process.env.GHN_API_URL}/master-data/ward`,
    {
      headers: {
        "Content-Type": "application/json",
        Token: process.env.GHN_API_KEY,
      },
      params: {
        district_id: districtId,
      },
    }
  );
  const wards = response.data.data;
  const ward = wards.map((ward) => ({
    WardCode: ward.WardCode,
    WardName: ward.WardName,
    DistrictID: ward.DistrictID,
  }));
  return ward;
};

const getAllUserAddress = async () => {
  const allUserAddress = await UserAddress.findAll();
  if (allUserAddress.length === 0) {
    throw new Error("UserAddress not found");
  }
  const addresses = allUserAddress.map((allUserAddress) => {
    const addr = allUserAddress.toJSON();
    return {
      addressId: addr.id,
      fullName: addr.fullName,
      phoneNumber: addr.phoneNumber,
      fullAddress: addr.fullAddress,
      addressType: addr.addressType,
      isPrimary: addr.isPrimary,
    };
  });
  return addresses;
};
const getMyUserAddress = async (userId) => {
  const myUserAddress = await UserAddress.findAll({
    where: { userId: userId },
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
      fullAddress: address.fullAddress,
      addressType: address.addressType,
      isPrimary: address.isPrimary,
    };
  });
  return addressData;
};
const getUserAddressById = async (addressId) => {
  const userAddress = await UserAddress.findByPk(addressId);
  if (!userAddress) {
    throw new Error("UserAddress not found");
  }
  const response = {
    addressId: userAddress.id,
    fullName: userAddress.fullName,
    phoneNumber: userAddress.phoneNumber,
    fullAddress: userAddress.fullAddress,
    addressType: userAddress.addressType,
    isPrimary: userAddress.isPrimary,
  };

  return response;
};

const createUserAddress = async ({
  userId,
  fullName,
  phoneNumber,
  provinceId,
  districtId,
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

  const userAddress = await UserAddress.create({
    userId: userId,
    fullName: fullName,
    phoneNumber: phoneNumber,
    provinceId: provinceId,
    districtId: districtId,
    wardCode: wardCode,
    address: address,
    fullAddress: `${address}, ${wardName.WardName}, ${districtName.DistrictName}, ${provinceName.ProvinceName}`,
    addressType: addressType,
    isPrimary: isPrimary,
  });
  const response = {
    addressId: userAddress.id,
    fullName: userAddress.fullName,
    phoneNumber: userAddress.phoneNumber,
    fullAddress: userAddress.fullAddress,
    addressType: userAddress.addressType,
    isPrimary: userAddress.isPrimary,
  };
  return response;
};

const updateUserAddress = async ({
  userId,
  addressId,
  fullName,
  phoneNumber,
  provinceId,
  districtId,
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

    const userAddress = await currentAddress.update(
      {
        fullName,
        phoneNumber,
        provinceId,
        districtId,
        wardCode,
        address,
        fullAddress: `${address}, ${wardName.WardName}, ${districtName.DistrictName}, ${provinceName.ProvinceName}`,
        addressType,
        isPrimary,
      },
      { transaction }
    );
    const response = {
      addressId: userAddress.id,
      fullName: userAddress.fullName,
      phoneNumber: userAddress.phoneNumber,
      fullAddress: userAddress.fullAddress,
      addressType: userAddress.addressType,
      isPrimary: userAddress.isPrimary,
    };
    await transaction.commit();
    return response;
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

module.exports = {
  getProvinces,
  getDistrictsByProvinceID,
  getWardByDistrictID,
  getAllUserAddress,
  getMyUserAddress,
  getUserAddressById,
  createUserAddress,
  updateUserAddress,
  deleteUserAddress,
};
