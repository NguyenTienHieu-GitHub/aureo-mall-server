const pool = require("../../config/db/index");
const addressModel = require("../../app/models/AddressModel");

const getAllAddress = async (req, res) => {
  try {
    const addressResult = await pool.query(addressModel.getAllAddress);
    if (addressResult.rows.length === 0) {
      return res.status(400).json({ message: "Address not found" });
    } else {
      return res.status(200).json(addressResult.rows);
    }
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
    const getAddressByIdResult = await pool.query(addressModel.getAddressById, [
      addressId,
    ]);
    if (!getAddressByIdResult.rows[0]) {
      return res
        .status(400)
        .json({ success: false, message: "Address not found" });
    }
    const addressById = getAddressByIdResult.rows[0];
    return res.status(200).json({ success: true, addressById });
  } catch (error) {}
};

const addAddress = async (req, res) => {
  const {
    firstName,
    lastName,
    numberPhone,
    province,
    district,
    ward,
    address,
  } = req.body;
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }
    const addAddressResult = await pool.query(addressModel.addAddress, [
      userId,
      firstName,
      lastName,
      numberPhone,
      province,
      district,
      ward,
      address,
    ]);
    if (!addAddressResult || addAddressResult.rowCount === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Address creation failed" });
    }
    const insertedAddress = addAddressResult.rows[0];
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
    numberPhone,
    province,
    district,
    ward,
    address,
  } = req.body;
  try {
    const userId = req.user.user_id;
    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User not authenticated" });
    }
    const updateAddressResult = await pool.query(addressModel.updateAddress, [
      firstName,
      lastName,
      numberPhone,
      province,
      district,
      ward,
      address,
      addressId,
      userId,
    ]);
    if (!updateAddressResult) {
      return res.status(400).json({
        success: false,
        message: "Address update failed or not found",
      });
    }
    const updateAddress = updateAddressResult.rows[0];
    return res.status(200).json({ success: true, updateAddress });
  } catch (err) {
    console.error("Error updating address: ", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  const userId = req.user.user_id;
  try {
    const deleteAddressResult = await pool.query(addressModel.deleteAddress, [
      addressId,
      userId,
    ]);
    if (!deleteAddressResult || deleteAddressResult.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found" });
    }
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
