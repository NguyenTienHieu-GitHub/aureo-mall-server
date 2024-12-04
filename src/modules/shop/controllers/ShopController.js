const ShopService = require("../../shop/services/ShopService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const createShop = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "TOKEN_ERROR",
      errorMessage: "You are not authenticated",
    });
  }
  const {
    shopName,
    description,
    provinceCode,
    districtCode,
    wardCode,
    address,
    isPrimary,
    phone,
    email,
    logo,
    website,
  } = req.body;
  const shopData = {
    userId: userId,
    shopName,
    description,
    provinceCode,
    districtCode,
    wardCode,
    address,
    isPrimary,
    phone,
    email,
    logo,
    website,
  };
  try {
    const newShop = await ShopService.createShop(shopData);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Created shop successfully",
      data: newShop,
    });
  } catch (error) {
    if (error.message.includes("Create shop failed")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "CREATE_SHOP_ERROR",
        errorMessage: "Create shop failed",
      });
    } else if (error.message.includes("Shop name already exists")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "SHOP_NAME_EXISTS",
        errorMessage: "You need to create a name for a new shop",
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
  createShop,
};
