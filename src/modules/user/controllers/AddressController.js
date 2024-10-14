const AddressService = require("../services/AddressService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllAddress = async (req, res) => {
  try {
    const addresses = await AddressService.getAllAddress();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all addresses successfully",
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Address not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "Address not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
const getAddressById = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Missing required fields: id",
    });
  }
  try {
    const addressById = await AddressService.getAddressById(addressId);

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show addresses successfully",
      data: {
        addressId: addressById.id,
        userId: addressById.userId,
        firstName: addressById.firstName,
        lastName: addressById.lastName,
        phoneNumber: addressById.phoneNumber,
        province: addressById.province,
        district: addressById.district,
        ward: addressById.ward,
        address: addressById.address,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Address not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "Address not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
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
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
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
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Address created successfully",
      data: {
        addressId: insertedAddress.id,
        userId: insertedAddress.userId,
        firstName: insertedAddress.firstName,
        lastName: insertedAddress.lastName,
        phoneNumber: insertedAddress.phoneNumber,
        province: insertedAddress.province,
        district: insertedAddress.district,
        ward: insertedAddress.ward,
        address: insertedAddress.address,
      },
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Address creation failed")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "CREATE_ADDRESS_ERROR",
        errorMessage: "Address creation failed",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};

const updateAddress = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: "Missing required fields: id",
    });
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
      res.locals.errorMessage = "You are not authenticated";
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
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
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Address updated successfully",
      data: updatedAddress,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("Address not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "Address not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};

const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  if (!addressId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required fields: id",
    });
  }
  try {
    const userId = req.user.id;
    if (!userId) {
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
    }
    await AddressService.deleteAddress({
      addressId,
      userId: userId,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Address deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address", error);
    if (error.message === "Address not found") {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "Address not found in the database",
      });
    } else {
      return setResponseLocals({
        res,
        statusCode: 500,
        errorCode: "INTERNAL_SERVER_ERROR",
        errorMessage: error.message,
      });
    }
  }
};
module.exports = {
  getAllAddress,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
};
