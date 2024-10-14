const CategoryService = require("../services/CategoryService");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");

const createCategory = async (req, res) => {
  const { categoryName, parentId } = req.body;
  try {
    const allCategories = await CategoryService.createCategory({
      categoryName,
      parentId,
    });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Category created successfully",
      data: allCategories,
    });
  } catch (error) {
    if (error.message.includes("Category created failed")) {
      return setResponseLocals({
        res,
        statusCode: 400,
        errorCode: "CREATE_CATEGORY_ERROR",
        errorMessage: "Category created failed",
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
    const categoryTree = await CategoryService.getAllCategory();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Show all categories",
      data: categoryTree,
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
module.exports = {
  createCategory,
  getAllCategory,
};
