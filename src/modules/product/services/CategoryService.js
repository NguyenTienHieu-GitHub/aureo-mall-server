const { Category, ImageCategory } = require("../models/CategoryModel");
const { uploadFilesToCloudinary } = require("../../../shared/utils/upload");
const sequelize = require("../../../config/db/index");
const createCategory = async ({
  categoryName,
  parentId,
  toggle,
  imageUrls,
}) => {
  const transaction = await sequelize.transaction();
  try {
    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("ImageUrls missing");
    }
    const imageUrl = await uploadFilesToCloudinary(
      imageUrls,
      categoryName,
      "categories"
    );
    const category = await Category.create(
      {
        categoryName,
        parentId,
        toggle,
      },
      { transaction }
    );
    if (imageUrl && imageUrl.length > 0) {
      await Promise.all(
        imageUrl.map((imageUrl) =>
          ImageCategory.create(
            {
              imageUrl: imageUrl,
              categoryId: category.id,
            },
            { transaction }
          )
        )
      );
    }
    await transaction.commit();
    const categories = await getCategoriesData(category.id);
    return categories;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const getAllCategories = async () => {
  const categories = await Category.findAll({
    where: { parentId: null },
    include: [
      {
        model: ImageCategory,
        as: "ImageCategories",
        attributes: ["imageUrl"],
      },
      {
        model: Category,
        as: "children",
        attributes: ["id", "categoryName", "parentId", "toggle"],
        include: [
          {
            model: ImageCategory,
            as: "ImageCategories",
            attributes: ["imageUrl"],
          },
          {
            model: Category,
            as: "children",
            attributes: ["id", "categoryName", "parentId", "toggle"],
            include: [
              {
                model: ImageCategory,
                as: "ImageCategories",
                attributes: ["imageUrl"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (categories.length === 0) {
    throw new Error("Categories not found");
  }
  const allCategories = categories
    .filter((category) => category.toggle == true)
    .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
    .map((category) => ({
      categoryId: category.id,
      categoryName: category.categoryName,
      image:
        category.ImageCategories.length > 0
          ? category.ImageCategories[0].imageUrl
          : null,
      children: category.children
        .filter((child) => child.toggle == true)
        .sort((a, b) => a.categoryName.localeCompare(b.categoryName))
        .map((child) => ({
          categoryId: child.id,
          categoryName: child.categoryName,
          image:
            child.ImageCategories.length > 0
              ? child.ImageCategories[0].imageUrl
              : null,
        })),
    }));
  return allCategories;
};
const getAllCategoriesAdmin = async () => {
  const categories = await Category.findAll({
    where: { parentId: null },
    include: [
      {
        model: ImageCategory,
        as: "ImageCategories",
        attributes: ["imageUrl"],
      },
      {
        model: Category,
        as: "children",
        attributes: ["id", "categoryName", "parentId", "toggle", "updatedAt"],
        include: [
          {
            model: ImageCategory,
            as: "ImageCategories",
            attributes: ["imageUrl"],
          },
          {
            model: Category,
            as: "children",
            attributes: [
              "id",
              "categoryName",
              "parentId",
              "toggle",
              "updatedAt",
            ],
            include: [
              {
                model: ImageCategory,
                as: "ImageCategories",
                attributes: ["imageUrl"],
              },
            ],
          },
        ],
      },
    ],
  });
  if (categories.length === 0) {
    throw new Error("Categories not found");
  }
  const allCategories = categories.map((category) => ({
    categoryId: category.id,
    categoryName: category.categoryName,
    toggle: category.toggle,
    updatedAt: category.updatedAt,
    image:
      category.ImageCategories.length > 0
        ? category.ImageCategories[0].imageUrl
        : null,
    children: category.children.map((child) => ({
      categoryId: child.id,
      categoryName: child.categoryName,
      toggle: child.toggle,
      updatedAt: child.updatedAt,
      image:
        child.ImageCategories.length > 0
          ? child.ImageCategories[0].imageUrl
          : null,
    })),
  }));
  return allCategories;
};
const getCategoriesData = async (categoryId) => {
  const category = await Category.findOne({
    where: { id: categoryId },
    include: [
      {
        model: ImageCategory,
        as: "ImageCategories",
        attributes: ["imageUrl"],
      },
      {
        model: Category,
        as: "parent",
        attributes: ["id", "categoryName", "parentId", "toggle", "updatedAt"],
        include: [
          {
            model: ImageCategory,
            as: "ImageCategories",
            attributes: ["imageUrl"],
          },
        ],
      },
    ],
  });

  if (!category) {
    return null;
  }

  const categoryData = {
    categoryId: category.id,
    categoryName: category.categoryName,
    toggle: category.toggle,
    updatedAt: category.updatedAt,
    image:
      category.ImageCategories && category.ImageCategories.length > 0
        ? category.ImageCategories[0].imageUrl
        : null,
    parent: category.parent
      ? {
          categoryId: category.parent.id,
          categoryName: category.parent.categoryName,
          toggle: category.parent.toggle,
          updatedAt: category.parent.updatedAt,
          image:
            category.parent.ImageCategories &&
            category.parent.ImageCategories.length > 0
              ? category.parent.ImageCategories[0].imageUrl
              : null,
        }
      : null,
  };

  return categoryData;
};

const updateCategoryById = async ({
  categoryId,
  categoryName,
  parentId,
  toggle,
  imageUrls,
}) => {
  try {
    const transaction = await sequelize.transaction();
    if (!imageUrls || imageUrls.length === 0) {
      throw new Error("ImageUrls missing");
    }
    const uploadedImageUrls = await uploadFilesToCloudinary(
      imageUrls,
      categoryName,
      "categories"
    );

    await Category.update(
      { categoryName, parentId, toggle },
      { where: { id: categoryId } },
      { transaction }
    );
    await ImageCategory.destroy({
      where: { categoryId },
      transaction,
    });
    await Promise.all(
      uploadedImageUrls.map((url) =>
        ImageCategory.create({ categoryId, imageUrl: url }, { transaction })
      )
    );
    await transaction.commit();
    const categories = await getCategoriesData(categoryId);
    return categories;
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const deleteCategoryAndChildren = async (categoryId) => {
  try {
    const category = await Category.findOne({
      where: { id: categoryId },
    });
    if (!category) {
      throw new Error(`Category with id ${categoryId} not found`);
    }
    const children = await Category.findAll({
      where: { parentId: categoryId },
    });
    if (children.length > 0) {
      for (const child of children) {
        if (child && child.id) {
          await deleteCategoryAndChildren(child.id);
        }
      }
    }
    await Category.destroy({ where: { id: categoryId } });
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createCategory,
  getAllCategories,
  updateCategoryById,
  deleteCategoryAndChildren,
  getAllCategoriesAdmin,
};
