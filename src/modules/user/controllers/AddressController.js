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
const getMyAddress = async (req, res) => {
  const userId = req.user.id;
  try {
    const addressData = await AddressService.getMyAddress(userId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all my address",
      data: addressData,
    });
  } catch (error) {
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
    const addressesById = await AddressService.getAddressById(addressId);

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show addresses successfully",
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

    const addressData = await AddressService.createAddress({
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
      statusCode: 200,
      messageSuccess: "Address created successfully",
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
      res.locals.errorMessage = "You are not authenticated";
      return setResponseLocals({
        res,
        statusCode: 401,
        errorCode: "TOKEN_INVALID",
        errorMessage: "You are not authenticated",
      });
    }
    const addressData = await AddressService.updateAddress({
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
      messageSuccess: "Address updated successfully",
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

const getProvinces = async (req, res) => {
  try {
    const provincesData = await AddressService.getProvinces();
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
    const districtsData = await AddressService.getDistricts();
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
    const wardsData = await AddressService.getWards();
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
      await AddressService.getAdministrativeRegion();
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
    const administrativeUnits = await AddressService.getAdministrativeUnit();
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
      await AddressService.getDistrictsByProvinceCode(provinceCode);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show district by province successfully",
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
    const wardByDistrictCode = await AddressService.getWardByDistrictCode(
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
