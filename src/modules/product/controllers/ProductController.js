const ProductService = require("../../product/services/ProductService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const getAllProductsAdmin = async (req, res) => {
  try {
    const products = await ProductService.getAllProductsAdmin();
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
const getPromotedProducts = async (req, res) => {
  const { type, limit, page } = req.query;
  try {
    const products = await ProductService.getPromotedProducts(
      type,
      limit,
      page
    );
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all promoted products",
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
    optionList,
    quantity,
    weight,
  } = req.body;
  const mediaList = req.files.map((file) => file.path);
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
      mediaList: mediaList,
      optionList,
      quantity,
      weight,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Product created successfully",
      data: productData,
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
  try {
    const productData = await ProductService.getProductBySlug(slug);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show product successfully",
      data: productData,
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
  const {
    productName,
    originalPrice,
    discountPrice,
    discountType,
    discountStartDate,
    discountEndDate,
    description,
    categoryId,
    optionList,
    quantity,
  } = req.body;

  const mediaList = req.files.map((file) => file.path);
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
      mediaList: mediaList,
      optionList,
      quantity,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Product updated successfully",
      data: productData,
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
const searchByNameProduct = async (req, res) => {
  const { searchItems } = req.body;
  try {
    const productData = await ProductService.searchByNameProduct({
      searchItems,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: `Show all product by name: ${searchItems}`,
      data: productData,
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
const getProductById = async (req, res) => {
  const productId = req.params.productId;
  try {
    const productData = await ProductService.getProductById(productId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show product successfully",
      data: productData,
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

const createRatingProduct = async (req, res) => {
  const productId = req.params.productId;
  const { rating, comment } = req.body;
  const userId = req.user.id;
  const mediaUrl = req.files.map((file) => file.path);
  if (!rating || rating < 1 || rating > 5) {
    return setResponseLocals({
      res,
      statusCode: 400,
      errorCode: "INVALID_RATING",
      errorMessage: "Rating must be a number between 1 and 5",
    });
  }
  try {
    await ProductService.createRatingProduct({
      productId: productId,
      userId: userId,
      rating,
      comment,
      mediaUrl: mediaUrl,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Created rating successfully",
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
const getAllRatingOfProduct = async (req, res) => {
  const productId = req.params.productId;
  try {
    const rating = await ProductService.getAllRatingOfProduct(productId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all rating of product",
      data: rating,
    });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_FOUND",
        errorMessage: "Product not found in database",
      });
    } else if (error.message.includes("Product is not rating")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "PRODUCT_NOT_RATING",
        errorMessage: "Product is not rating",
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
  getAllProductsAdmin,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchByNameProduct,
  getProductById,
  createRatingProduct,
  getAllRatingOfProduct,
  getPromotedProducts,
};
