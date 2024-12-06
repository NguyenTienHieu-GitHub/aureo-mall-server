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
  if (!isUUID(addressId)) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "PARAMS_INCORRECT_FORMAT",
      errorMessage: "Invalid params format: uuid",
    });
  }
  try {
    const addressesById = await UserAddressService.getUserAddressById(
      addressId
    );

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show address successfully",
      data: {
        addressId: addressesById.id,
        fullName: addressesById.fullName,
        phoneNumber: addressesById.phoneNumber,
        provinceCode: addressesById.provinceCode,
        provinceName: addressesById.Province.name,
        districtCode: addressesById.districtCode,
        districtName: addressesById.District.name,
        wardCode: addressesById.wardCode,
        wardName: addressesById.Ward.name,
        address: addressesById.address,
        addressType: addressesById.addressType,
        isPrimary: addressesById.isPrimary,
      },
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
    provinceCode,
    districtCode,
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
      provinceCode,
      districtCode,
      wardCode,
      address,
      addressType,
      isPrimary,
    });
    return setResponseLocals({
      res,
      statusCode: 201,
      messageSuccess: "UserAddress created successfully",
      data: {
        addressId: addressData.id,
        fullName: addressData.fullName,
        phoneNumber: addressData.phoneNumber,
        provinceCode: addressData.provinceCode,
        provinceName: addressData.Province.name,
        districtCode: addressData.districtCode,
        districtName: addressData.District.name,
        wardCode: addressData.wardCode,
        wardName: addressData.Ward.name,
        address: addressData.address,
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      },
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
    provinceCode,
    districtCode,
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
      provinceCode,
      districtCode,
      wardCode,
      address,
      addressType,
      isPrimary,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "UserAddress updated successfully",
      data: {
        addressId: addressData.id,
        fullName: addressData.fullName,
        phoneNumber: addressData.phoneNumber,
        provinceCode: addressData.provinceCode,
        provinceName: addressData.Province.name,
        districtCode: addressData.districtCode,
        districtName: addressData.District.name,
        wardCode: addressData.wardCode,
        wardName: addressData.Ward.name,
        address: addressData.address,
        addressType: addressData.addressType,
        isPrimary: addressData.isPrimary,
      },
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
const getDistricts = async (req, res) => {
  try {
    const districtsData = await UserAddressService.getDistricts();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all districts",
      data: districtsData,
    });
  } catch (error) {
    if (error.message.includes("Districts not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "DISTRICT_NOT_FOUND",
        errorMessage: "Districts not found in the database",
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
const getWards = async (req, res) => {
  try {
    const wardsData = await UserAddressService.getWards();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all wards",
      data: wardsData,
    });
  } catch (error) {
    if (error.message.includes("Wards not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "WARDS_NOT_FOUND",
        errorMessage: "Wards not found in the database",
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
const getAdministrativeRegion = async (req, res) => {
  try {
    const administrativeRegions =
      await UserAddressService.getAdministrativeRegion();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all administrative regions",
      data: administrativeRegions,
    });
  } catch (error) {
    if (error.message.includes("Administrative regions not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADMINISTRATIVE_REGIONS_NOT_FOUND",
        errorMessage: "Administrative regions not found in the database",
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
const getAdministrativeUnit = async (req, res) => {
  try {
    const administrativeUnits =
      await UserAddressService.getAdministrativeUnit();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all administrative units",
      data: administrativeUnits,
    });
  } catch (error) {
    if (error.message.includes("Administrative units not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "ADMINISTRATIVE_UNITS_NOT_FOUND",
        errorMessage: "Administrative units not found in the database",
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

const getDistrictsByProvinceCode = async (req, res) => {
  const provinceCode = req.params.provinceCode;
  try {
    const districtByProvinceCode =
      await UserAddressService.getDistrictsByProvinceCode(provinceCode);
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
const getWardByDistrictCode = async (req, res) => {
  const districtCode = req.params.districtCode;
  try {
    const wardByDistrictCode = await UserAddressService.getWardByDistrictCode(
      districtCode
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
