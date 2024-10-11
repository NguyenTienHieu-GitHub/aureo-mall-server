const AddressService = require("../services/AddressService");

const getAllAddress = async (req, res) => {
  try {
    const addresses = await AddressService.getAllAddress();

    res.locals.message = "Show all addresses successfully";
    res.locals.data = addresses;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error retrieving addresses:", error);
    if (error.message === "Address not found") {
      res.locals.message = error.message;
      res.locals.error = "Address not found in the database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
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
    const addressById = await AddressService.getAddressById(addressId);
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
    console.error(error);
    if (error.message === "Address not found") {
      res.locals.error = "Address not found in the database";
      re.locals.message = error.message;
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const createAddress = async (req, res) => {
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
      res.locals.message = "You are not authenticated";
      res.locals.error = "You need to login";
      return res.status(400).json();
    }

    const insertedAddress = await AddressService.createAddress({
      userId: userId,
      firstName,
      lastName,
      phoneNumber,
      province,
      district,
      ward,
      address,
    });
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
    if (error.message === "Address creation failed") {
      res.locals.message = error.message;
      res.locals.error = "Address creation failed";
      return res.status(400).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
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
  try {
    const userId = req.user.id;
    if (!userId) {
      res.locals.message = "You are not authenticated";
      res.locals.error = "You need to login";
      return res.status(400).json();
    }
    const updatedAddress = await AddressService.updateAddress({
      userId: userId,
      addressId,
      firstName,
      lastName,
      phoneNumber,
      province,
      district,
      ward,
      address,
    });
    res.locals.message = "Address updated successfully";
    res.locals.data = updatedAddress;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error("Error updating address: ", error);
    if (error.message === "Address not found") {
      res.locals.error = "Address not found in the database.";
      res.locals.message = error.message;
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
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
      res.locals.message = "You are not authenticated";
      res.locals.error = "You need to login";
      return res.status(400).json();
    }
    await AddressService.deleteAddress({
      addressId,
      userId: userId,
    });
    res.locals.message = "Address deleted successfully";
    return res.status(200).json();
  } catch (error) {
    if (error.message === "Address not found") {
      res.locals.error = "Address not found in the database";
      res.locals.message = error.message;
      return res.status(404).json();
    }
    console.error("Error deleting address", error);
    res.locals.message = "Internal Server Error";
    res.locals.error = error.message;
    return res.status(500).json();
  }
};
module.exports = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
