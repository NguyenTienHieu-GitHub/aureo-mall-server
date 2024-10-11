const ProductService = require("../../product/services/ProductService");

const getAllProducts = async (req, res) => {
  try {
    const products = await ProductService.getAllProducts();

    res.locals.message = "Show all products";
    res.locals.data = products;
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message === "Product not found") {
      res.locals.message = error.message;
      res.locals.error = "Product not found in the database";
      return res.status(404).json();
    } else {
      res.locals.messages = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};

const createProduct = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    res.locals.message = "You are not authenticated";
    res.locals.error = "You need to login";
    return res.status(400).json();
  }
  const {
    productName,
    originalPrice,
    discountPrice,
    discountType,
    discountStartDate,
    discountEndDate,
    description,
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
      mediaList,
      optionList,
      quantity,
    });

    res.locals.message = "Product created successfully";
    res.locals.data = {
      shopName: productData.Shop?.shopName,
      productName: productData.productName,
      originalPrice: productData.ProductPrice[0]?.originalPrice,
      discountPrice: productData.ProductPrice[0]?.discountPrice,
      discountType: productData.ProductPrice[0]?.discountType,
      discountStartDate: productData.ProductPrice[0]?.discountStartDate,
      discountEndDate: productData.ProductPrice[0]?.discountEndDate,
      finalPrice: productData.ProductPrice[0]?.finalPrice,
      description: productData.description,
      mediaList: productData.ProductMedia,
      optionList: productData.ProductOptions,
      quantity: productData.Inventory[0]?.quantity,
      slug: productData.slug,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    console.error(error);
    if (
      error.message === "You need to create a store before creating products"
    ) {
      res.locals.message =
        "You need to create a store before creating products";
      res.locals.error = "You don't have a store";
      return res.status(404).json();
    } else if (
      error.message.includes(
        "Both the discount type, discount start date and discount end date must be provided when the discount price is set"
      )
    ) {
      res.locals.error = error.message;
      res.locals.message =
        "You need to create a discount type, a discount start date and a discount end date";
      return res.status(400).json();
    } else if (
      error.message.includes(
        "Discount end date must be greater than the start date"
      )
    ) {
      res.locals.message = error.message;
      res.locals.error =
        "You need to create a discount end date that is less than the discount start date";
      return res.status(400).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error;
      return res.status(500).json();
    }
  }
};

const getProductBySlug = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.locals.message = "Missing required field";
    res.locals.error = "Missing required field: slug";
    return res.status(404).json();
  }
  try {
    const productData = await ProductService.getProductBySlug(slug);
    res.locals.message = "Show product successfully";
    res.locals.data = {
      shopName: productData.Shop?.shopName,
      productName: productData.productName,
      originalPrice: productData.ProductPrice[0]?.originalPrice,
      discountPrice: productData.ProductPrice[0]?.discountPrice,
      discountType: productData.ProductPrice[0]?.discountType,
      discountStartDate: productData.ProductPrice[0]?.discountStartDate,
      discountEndDate: productData.ProductPrice[0]?.discountEndDate,
      finalPrice: productData.ProductPrice[0]?.finalPrice,
      description: productData.description,
      mediaList: productData.ProductMedia,
      optionList: productData.ProductOptions,
      quantity: productData.Inventory[0]?.quantity,
      slug: productData.slug,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      res.locals.error = error.message;
      res.locals.message = "Product not found in database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const updateProduct = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.locals.message = "Missing required field";
    res.locals.error = "Missing required field: slug";
    return res.status(404).json();
  }
  const {
    productName,
    originalPrice,
    discountPrice,
    discountType,
    discountStartDate,
    discountEndDate,
    description,
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
      mediaList,
      optionList,
      quantity,
    });

    res.locals.message = "Product created successfully";
    res.locals.data = {
      shopName: productData.Shop?.shopName,
      productName: productData.productName,
      originalPrice: productData.ProductPrice[0]?.originalPrice,
      discountPrice: productData.ProductPrice[0]?.discountPrice,
      discountType: productData.ProductPrice[0]?.discountType,
      discountStartDate: productData.ProductPrice[0]?.discountStartDate,
      discountEndDate: productData.ProductPrice[0]?.discountEndDate,
      finalPrice: productData.ProductPrice[0]?.finalPrice,
      description: productData.description,
      mediaList: productData.ProductMedia,
      optionList: productData.ProductOptions,
      quantity: productData.Inventory[0]?.quantity,
      slug: productData.slug,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
    return res.status(200).json({ data: res.locals.data });
  } catch (error) {
    if (error.message.includes("Product not found")) {
      res.locals.error = error.message;
      res.locals.message = "Product not found in database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const deleteProduct = async (req, res) => {
  const slug = req.params.slug;
  if (!slug) {
    res.locals.message = "Missing required field";
    res.locals.error = "Missing required field: slug";
    return res.status(404).json();
  }
  try {
    await ProductService.deleteProduct(slug);
    res.locals.message = "Product deleted successfully";
    return res.status(200).json();
  } catch (error) {
    if (error.message.includes("Product not found")) {
      res.locals.error = error.message;
      res.locals.message = "Product not found in database";
      return res.status(404).json();
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error.message;
      return res.status(500).json();
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
