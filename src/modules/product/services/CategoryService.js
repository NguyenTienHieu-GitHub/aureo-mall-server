const Category = require("../models/CategoryModel");
const slugify = require("slugify");

const generateSlug = async (categoryName, existingSlug = null) => {
  const baseSlug = slugify(categoryName, { lower: true });
  let slug = baseSlug;
  let index = 1;

  while (
    existingSlug === slug ||
    (await Category.findOne({ where: { slug } }))
  ) {
    slug = `${baseSlug}-${index}`;
    index++;
  }

  return slug;
};
const createCategory = async ({ categoryName, parentId }) => {
  const slug = await generateSlug(categoryName);
  const category = await Category.create({
    categoryName,
    parentId,
    slug: slug,
  });
  if (!category) {
    throw new Error("Category created failed: " + categoryName);
  }
  const categories = await getCategoriesTree();
  return categories;
};
const getCategoriesTree = async () => {
  try {
    const categories = await Category.findAll();
    const buildCategoryTree = (categories, parentId = null) => {
      return categories
        .filter((category) => category.parentId === parentId)
        .map((category) => ({
          id: category.id,
          categoryName: category.categoryName,
          slug: category.slug,
          children: buildCategoryTree(categories, category.id),
        }));
    };

    const categoryTree = await buildCategoryTree(categories);
    return categoryTree;
  } catch (error) {
    throw new Error("Error fetching category tree: " + error.message);
  }
};
const getAllCategory = async () => {
  const categories = await Category.findAll();
  if (categories.length == 0) {
    throw new Error("Categories not found");
  }

  const categoriesTree = await getCategoriesTree();
  return categoriesTree;
};
module.exports = {
  generateSlug,
  createCategory,
  getCategoriesTree,
  getAllCategory,
};
