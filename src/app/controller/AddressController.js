const Address = require("../models/AddressModel");

const getAllAddress = async (req, res) => {
  try {
    const addressResult = await Address.findAll();
    if (!addressResult) {
      res.locals.message = "Address not found";
      res.locals.error = "Address not found in the database";
      return res.status(400).json();
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
    res.locals.message = "Show all addresses successfully";
    res.locals.data = addresses;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
const getAddressById = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  try {
    const getAddressByIdResult = await Address.findByPk(addressId);
    if (!getAddressByIdResult) {
      res.locals.message = "Address not found";
      res.locals.error = "Address not found in the database";
      return res.status(400).json();
    }
    const addressById = getAddressByIdResult.toJSON();
    res.locals.message = "Show addresses successfully";
    res.locals.data = {
      addressId: addressById.id,
      userId: addressById.userId,
      firstName: addressById.firstName,
      lastName: addressById.lastName,
      phoneNumber: addressById.phoneNumber,
      province: addressById.province,
      district: addressById.district,
      ward: addressById.ward,
      address: addressById.address,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const addAddress = async (req, res) => {
  const {
    firstName,
    lastName,
    phoneNumber,
    province,
    district,
    ward,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !province ||
    !district ||
    !ward ||
    !address
  ) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, phoneNumber, province, district, ward, address";
    return res.status(401).json();
  }
  try {
    const userId = req.user.id;
    if (!userId) {
      res.locals.message = "User not authenticated";
      res.locals.error = "User ID is required.";
      return res.status(400).json();
    }
    const addAddressResult = await Address.create({
      userId: userId,
      firstName,
      lastName,
      phoneNumber,
      province,
      district,
      ward,
      address,
    });
    if (!addAddressResult) {
      res.locals.message = "Address creation failed";
      res.locals.error = "Address creation failed";
      return res.status(400).json();
    }
    const insertedAddress = addAddressResult.toJSON();
    res.locals.message = "Created address successfully";
    res.locals.data = {
      addressId: insertedAddress.id,
      userId: insertedAddress.userId,
      firstName: insertedAddress.firstName,
      lastName: insertedAddress.lastName,
      phoneNumber: insertedAddress.phoneNumber,
      province: insertedAddress.province,
      district: insertedAddress.district,
      ward: insertedAddress.ward,
      address: insertedAddress.address,
    };
    return res.status(201).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error adding address:", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const updateAddress = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id";
    return res.status(400).json();
  }
  const {
    firstName,
    lastName,
    phoneNumber,
    province,
    district,
    ward,
    address,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !phoneNumber ||
    !province ||
    !district ||
    !ward ||
    !address
  ) {
    res.locals.message = "Missing required fields";
    res.locals.error =
      "Missing required fields: firstName, lastName, phoneNumber, province, district, ward, address";
    return res.status(401).json();
  }
  try {
    const userId = req.user.id;
    if (!userId) {
      res.locals.message = "User not authenticated.";
      res.locals.error = "User ID is required.";
      return res.status(400).json();
    }
    const addressToUpdate = await Address.findOne({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    if (!addressToUpdate) {
      res.locals.message = "Address not found";
      return res.status(404).json();
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
    res.locals.message = "Address updated successfully";
    res.locals.data = updatedAddress;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error updating address: ", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    res.locals.message = "Missing required fields";
    res.locals.error = "Missing required fields: id, userId";
    return res.status(400).json();
  }
  try {
    const userId = req.user.id;
    if (!userId) {
      res.locals.message = "User not authenticated.";
      res.locals.error = "User ID is required.";
      return res.status(400).json();
    }
    const addressToDelete = await Address.findOne({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    if (!addressToDelete) {
      res.locals.message = "Address not found";
      res.locals.error = "Address not found in the database";
      return res.status(404).json();
    }
    await Address.destroy({
      where: {
        id: addressId,
      },
    });
    res.locals.message = "Address deleted successfully";
    return res.status(200).json();
  } catch (error) {
    console.error("Error deleting address", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
module.exports = {
  getAllAddress,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
};
