const Address = require("../models/AddressModel");

const getAllAddress = async (req, res) => {
  try {
    const addressResult = await Address.findAll();
    if (!addressResult) {
      return res.status(400).json({ message: "Address not found" });
    }
    return res.status(200).json(addressResult);
  } catch (err) {
    console.error("Error retrieving addresses:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const getAddressById = async (req, res) => {
  const addressId = req.params.id;

  try {
    const getAddressByIdResult = await findByPk(addressId);
    if (!getAddressByIdResult) {
      return res
        .status(400)
        .json({ success: false, message: "Address not found" });
    }
    const addressById = getAddressByIdResult.toJSON();
    return res.status(200).json({ success: true, addressById });
  } catch (error) {}
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
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }
    const addAddressResult = await Address.create({
      id: userId,
      firstName,
      lastName,
      phoneNumber,
      province,
      district,
      ward,
      address,
    });
    if (!addAddressResult) {
      return res
        .status(400)
        .json({ success: false, message: "Address creation failed" });
    }
    const insertedAddress = addAddressResult.toJSON();
    return res.status(201).json({
      success: true,
      insertedAddress,
    });
  } catch (err) {
    console.error("Error adding address:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const {
    firstName,
    lastName,
    phoneNumber,
    province,
    district,
    ward,
    address,
  } = req.body;
  try {
    const userId = req.user.id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }
    const addressToUpdate = await Address.findOne({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    if (!addressToUpdate) {
      return res.status(404).json({
        success: false,
        message: "Address not found or not authorized",
      });
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
    return res.status(200).json({ success: true, updatedAddress });
  } catch (err) {
    console.error("Error updating address: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  const userId = req.user.id;
  try {
    const addressToDelete = await Address.findOne({
      where: {
        id: addressId,
        userId: userId,
      },
    });
    if (!addressToDelete) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
    await Address.destroy({
      where: {
        id: addressId,
      },
    });
    return res
      .status(200)
      .json({ success: true, message: "Delete Address Successfully" });
  } catch (err) {
    console.error("Error deleting address", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
module.exports = {
  getAllAddress,
  getAddressById,
  addAddress,
  updateAddress,
  deleteAddress,
};
