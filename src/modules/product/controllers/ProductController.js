const ProductService = require("../../product/services/ProductService");

const getAllProducts = async (req, res) => {
  try {
    const getAllProducts = await ProductService.getAllProducts();
    res.locals.messages = "Show all products";
    res.locals.data = getAllProducts;
    return res.status(200).json();
  } catch (error) {
    if (error.message === "Product not found") {
      res.locals.messages = error.message;
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
  const { productName, description, mediaList, optionList, quantity } =
    req.body;
  try {
    const newProduct = await ProductService.createProduct({
      userId: userId,
      productName,
      description,
      mediaList,
      optionList,
      quantity,
    });

    res.locals.messages = "Product created successfully";
    res.locals.data = newProduct;
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
    } else {
      res.locals.message = "Internal Server Error";
      res.locals.error = error;
      return res.status(500).json();
    }
  }
};
module.exports = {
  getAllProducts,
  createProduct,
};
