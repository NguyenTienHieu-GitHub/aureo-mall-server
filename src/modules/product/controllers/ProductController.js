const ProductService = require("../../product/services/ProductService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all products",
      data: products,
    });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_FOUND",
        errorMessage: "Product not found in the database",
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

const createProduct = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return setResponseLocals({
      res,
      statusCode: 401,
      errorCode: "TOKEN_INVALID",
      errorMessage: "You are not authenticated",
    });
  }
  const {
    productName,
    originalPrice,
    discountPrice,
    discountType,
    discountStartDate,
    discountEndDate,
    description,
    categoryId,
    mediaList,
    optionList,
    quantity,
  } = req.body;
  try {
    const productData = await ProductService.createProduct({
      userId: userId,
      productName,
      originalPrice,
      discountPrice,
      discountType,
      discountStartDate,
      discountEndDate,
      description,
      categoryId,
      mediaList,
      optionList,
      quantity,
    });

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Product created successfully",
      data: {
        shopName: productData.Shop?.shopName,
        productName: productData.productName,
        originalPrice: productData.ProductPrice[0]?.originalPrice,
        discountPrice: productData.ProductPrice[0]?.discountPrice,
        discountType: productData.ProductPrice[0]?.discountType,
        discountStartDate: productData.ProductPrice[0]?.discountStartDate,
        discountEndDate: productData.ProductPrice[0]?.discountEndDate,
        finalPrice: productData.ProductPrice[0]?.finalPrice,
        description: productData.description,
        categoryList:
          productData.Categories?.map((category) => category.categoryName) ||
          [],
        mediaList: productData.ProductMedia,
        optionList: productData.ProductOptions,
        quantity: productData.Inventory[0]?.quantity,
        slug: productData.slug,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      },
    });
  } catch (error) {
    console.error(error);
    if (
      error.message.includes(
        "You need to create a store before creating products"
      )
    ) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CREATE_PRODUCT_NO_ASSOCIATED_SHOP",
        errorMessage: "You need to create a store before creating products",
      });
    } else if (
      error.message.includes(
        "Both the discount type, discount start date and discount end date must be provided when the discount price is set"
      )
    ) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "CREATE_DISCOUNT_MISSING_REQUIRED_FIELDS",
        errorMessage:
          "You need to create a discount type, a discount start date and a discount end date",
      });
    } else if (
      error.message.includes(
        "Discount end date must be greater than the start date"
      )
    ) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "DISCOUNT_INVALID_DATE_RANGE",
        errorMessage:
          "You need to create a discount end date that is less than the discount start date",
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

const getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return setResponseLocals({
      res,
      statusCode: 404,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required field: slug",
    });
  }
  try {
    const productData = await ProductService.getProductBySlug(slug);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show product successfully",
      data: {
        shopName: productData.Shop?.shopName,
        productName: productData.productName,
        originalPrice: productData.ProductPrice[0]?.originalPrice,
        discountPrice: productData.ProductPrice[0]?.discountPrice,
        discountType: productData.ProductPrice[0]?.discountType,
        discountStartDate: productData.ProductPrice[0]?.discountStartDate,
        discountEndDate: productData.ProductPrice[0]?.discountEndDate,
        finalPrice: productData.ProductPrice[0]?.finalPrice,
        description: productData.description,
        categoryList:
          productData.Categories?.map((category) => category.categoryName) ||
          [],
        mediaList: {
          mediaType: productData.ProductMedia[0]?.mediaType,
          mediaUrl: productData.ProductMedia[0]?.mediaUrl,
          isFeatured: productData.ProductMedia[0]?.isFeatured,
        },
        optionList: productData.ProductOptions,
        quantity: productData.Inventory[0]?.quantity,
        slug: productData.slug,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      },
    });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_FOUND",
        errorMessage: "Product not found in database",
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
const updateProduct = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return setResponseLocals({
      res,
      statusCode: 404,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required field: slug",
    });
  }
  const {
    productName,
    originalPrice,
    discountPrice,
    discountType,
    discountStartDate,
    discountEndDate,
    description,
    categoryId,
    mediaList,
    optionList,
    quantity,
  } = req.body;
  try {
    const productData = await ProductService.updateProduct({
      slug: slug,
      productName,
      originalPrice,
      discountPrice,
      discountType,
      discountStartDate,
      discountEndDate,
      description,
      categoryId,
      mediaList,
      optionList,
      quantity,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Product created successfully",
      data: {
        shopName: productData.Shop?.shopName,
        productName: productData.productName,
        originalPrice: productData.ProductPrice[0]?.originalPrice,
        discountPrice: productData.ProductPrice[0]?.discountPrice,
        discountType: productData.ProductPrice[0]?.discountType,
        discountStartDate: productData.ProductPrice[0]?.discountStartDate,
        discountEndDate: productData.ProductPrice[0]?.discountEndDate,
        finalPrice: productData.ProductPrice[0]?.finalPrice,
        description: productData.description,
        categoryList:
          productData.Categories?.map((category) => category.categoryName) ||
          [],
        mediaList: productData.ProductMedia,
        optionList: productData.ProductOptions,
        quantity: productData.Inventory[0]?.quantity,
        slug: productData.slug,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      },
    });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_FOUND",
        errorMessage: "Product not found in database",
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
const deleteProduct = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    return setResponseLocals({
      res,
      statusCode: 404,
      errorCode: "MISSING_FIELD",
      errorMessage: "Missing required field: slug",
    });
  }
  try {
    await ProductService.deleteProduct(slug);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Product deleted successfully",
    });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_FOUND",
        errorMessage: "Product not found in database",
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
  getAllProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
