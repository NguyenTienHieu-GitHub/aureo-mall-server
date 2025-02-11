const CategoryService = require("../services/CategoryService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const createCategory = async (req, res) => {
  const { categoryName, parentId, toggle } = req.body;
  const imagePaths = req.files.map((file) => file.path);
  try {
    const allCategories = await CategoryService.createCategory({
      categoryName,
      parentId,
      toggle,
      imageUrls: imagePaths,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Category created successfully",
      data: allCategories,
    });
  } catch (error) {
    if (error.message.includes("ImageUrls missing")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "The field ImageUrls is required and cannot be empty",
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
const getAllCategory = async (req, res) => {
  try {
    const allCategories = await CategoryService.getAllCategories();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all categories",
      data: allCategories,
    });
  } catch (error) {
    if (error.message.includes("Categories not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CATEGORIES_NOT_FOUND",
        errorMessage: "Categories not found in the database",
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
const getAllCategoryAdmin = async (req, res) => {
  try {
    const allCategories = await CategoryService.getAllCategoriesAdmin();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all categories",
      data: allCategories,
    });
  } catch (error) {
    if (error.message.includes("Categories not found")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CATEGORIES_NOT_FOUND",
        errorMessage: "Categories not found in the database",
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
const updateCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;
  const { categoryName, parentId, toggle } = req.body;
  const imageUrls = req.files.map((file) => file.path);
  try {
    const allCategories = await CategoryService.updateCategoryById({
      categoryId: categoryId,
      categoryName,
      parentId,
      toggle,
      imageUrls: imageUrls,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Category created successfully",
      data: allCategories,
    });
  } catch (error) {
    if (error.message.includes("ImageUrls missing")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "MISSING_FIELD",
        errorMessage: "The field ImageUrls is required and cannot be empty",
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
const deleteCategoryById = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    await CategoryService.deleteCategoryAndChildren(categoryId);
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Category deleted successfully",
    });
  } catch (error) {
    if (error.message.includes("Category with id")) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "CATEGORIES_NOT_FOUND",
        errorMessage: "Category not found in the database",
      });
    }
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};
module.exports = {
  createCategory,
  getAllCategory,
  getAllCategoryAdmin,
  updateCategoryById,
  deleteCategoryById,
  getAllCategoryAdmin,
};
