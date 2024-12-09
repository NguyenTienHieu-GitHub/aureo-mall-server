const UserAddressService = require("../services/UserAddressService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllUserAddress = async (req, res) => {
  try {
    const addresses = await UserAddressService.getAllUserAddress();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all addresses successfully",
      data: addresses,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("UserAddress not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "UserAddress not found in the database",
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
const getMyUserAddress = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 401,
      errorCode: "TOKEN_INVALID",
      errorMessage: "You are not authenticated",
    });
  }
  try {
    const addressData = await UserAddressService.getMyUserAddress(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all my address",
      data: addressData,
    });
  } catch (error) {
    if (error.message.includes("UserAddress not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "UserAddress not found in the database",
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
const getUserAddressById = async (req, res) => {
  const addressId = req.params.id;
  try {
    const addressesById = await UserAddressService.getUserAddressById(
      addressId
    );

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show address successfully",
      data: addressesById,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("UserAddress not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "UserAddress not found in the database",
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

const createUserAddress = async (req, res) => {
  const {
    fullName,
    phoneNumber,
    provinceId,
    districtId,
    wardCode,
    address,
    addressType,
    isPrimary,
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

    const addressData = await UserAddressService.createUserAddress({
      userId: userId,
      fullName,
      phoneNumber,
      provinceId,
      districtId,
      wardCode,
      address,
      addressType,
      isPrimary,
    });
    return setResponseLocals({
      res,
      statusCode: 201,
      messageSuccess: "UserAddress created successfully",
      data: addressData,
    });
  } catch (error) {
    console.error(error);
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};

const updateUserAddress = async (req, res) => {
  const addressId = req.params.id;
  const {
    fullName,
    phoneNumber,
    provinceId,
    districtId,
    wardCode,
    address,
    addressType,
    isPrimary,
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
    const addressData = await UserAddressService.updateUserAddress({
      userId: userId,
      addressId,
      fullName,
      phoneNumber,
      provinceId,
      districtId,
      wardCode,
      address,
      addressType,
      isPrimary,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "UserAddress updated successfully",
      data: addressData,
    });
  } catch (error) {
    console.error(error);
    if (error.message.includes("UserAddress not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "UserAddress not found in the database",
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

const deleteUserAddress = async (req, res) => {
  const addressId = req.params.id;
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
    await UserAddressService.deleteUserAddress({
      addressId,
      userId: userId,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "UserAddress deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting address", error);
    if (error.message === "Cannot delete the primary address") {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "CANNOT_DELETE_ADDRESS",
        errorMessage: "Cannot delete the primary address",
      });
    } else if (error.message === "UserAddress not found") {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADDRESS_NOT_FOUND",
        errorMessage: "UserAddress not found in the database",
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

const getProvinces = async (req, res) => {
  try {
    const provincesData = await UserAddressService.getProvinces();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all provinces",
      data: provincesData,
    });
  } catch (error) {
    if (error.message.includes("Provinces not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PROVINCES_NOT_FOUND",
        errorMessage: "Provinces not found in the database",
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

const getDistrictsByProvinceID = async (req, res) => {
  const provinceId = req.params.provinceId;
  try {
    const districtByProvinceCode =
      await UserAddressService.getDistrictsByProvinceID({ provinceId });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show districts by province",
      data: districtByProvinceCode,
    });
  } catch (error) {
    if (error.message.includes("Province not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PROVINCE_NOT_FOUND",
        errorMessage: "Province not found in database",
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
const getWardByDistrictID = async (req, res) => {
  const districtId = req.params.districtId;
  try {
    const wardByDistrictCode = await UserAddressService.getWardByDistrictID(
      districtId
    );
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show wards by district",
      data: wardByDistrictCode,
    });
  } catch (error) {}
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
