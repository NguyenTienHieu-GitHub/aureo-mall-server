const CategoryService = require("../services/CategoryService");

const createCategory = async (req, res) => {
  const { categoryName, parentId } = req.body;
  try {
    const allCategories = await CategoryService.createCategory({
      categoryName,
      parentId,
    });
    res.locals.message = "Category created successfully";
    res.locals.data = allCategories;
    return res.status(200).json();
  } catch (error) {
    if (error.message.includes("Category created failed")) {
      res.locals.error = "Category created failed";
      return res.status(400).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
const getAllCategory = async (req, res) => {
  try {
    const categoryTree = await CategoryService.getAllCategory();
    res.locals.message = "Show all categories";
    res.locals.data = categoryTree;
    return res.status(200).json();
  } catch (error) {
    if (error.message.includes("Categories not found")) {
      res.locals.error = "Categories not found in the database";
      return res.stats(404).json();
    } else {
      res.locals.error = error.message;
      return res.status(500).json();
    }
  }
};
module.exports = {
  createCategory,
  getAllCategory,
};
