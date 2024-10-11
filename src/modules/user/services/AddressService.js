const Address = require("../models/AddressModel");

const getAllAddress = async () => {
  const addressResult = await Address.findAll();
  if (addressResult.length === 0) {
    throw new Error("Address not found");
  }
  const addresses = addressResult.map((addressResult) => {
    const addr = addressResult.toJSON();
    return {
      addressId: addr.id,
      userId: addr.userId,
      firstName: addr.firstName,
      lastName: addr.lastName,
      phoneNumber: addr.phoneNumber,
      province: addr.province,
      district: addr.district,
      ward: addr.ward,
      address: addr.address,
    };
  });
  return addresses;
};

const getAddressById = async (addressId) => {
  const getAddressByIdResult = await Address.findByPk(addressId);
  if (!getAddressByIdResult) {
    throw new Error("Address not found");
  }
  const addressById = getAddressByIdResult.toJSON();
  return addressById;
};

const createAddress = async ({
  userId,
  firstName,
  lastName,
  phoneNumber,
  province,
  district,
  ward,
  address,
}) => {
  const addAddressResult = await Address.create({
    userId,
    firstName,
    lastName,
    phoneNumber,
    province,
    district,
    ward,
    address,
  });
  if (!addAddressResult) {
    throw new Error("Address creation failed");
  }
  const insertedAddress = addAddressResult.toJSON();
  return insertedAddress;
};

const updateAddress = async ({
  userId,
  addressId,
  firstName,
  lastName,
  phoneNumber,
  province,
  district,
  ward,
  address,
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
      firstName,
      lastName,
      phoneNumber,
      province,
      district,
      ward,
      address,
    },
    {
      where: {
        id: addressId,
      },
    }
  );
  const updatedAddress = await Address.findOne({
    where: { id: addressId },
  });
  return updatedAddress;
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
module.exports = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
