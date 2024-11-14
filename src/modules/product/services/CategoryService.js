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
  const allCategories = [];
  const categories = await Category.findAll({
    include: [
      {
        model: ImageCategory,
        as: "ImageCategories",
        attributes: ["imageUrl"],
      },
      {
        model: Category,
        as: "children",
        attributes: ["id", "categoryName", "parentId"],
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
  if (categories.length === 0) {
    throw new Error("Categories not found");
  }
  for (const category of categories) {
    const path = [];
    const imageUrls = [];
    if (category.ImageCategories) {
      imageUrls.push(...category.ImageCategories.map((img) => img.imageUrl));
    }
    let parentId = category.parentId;
    while (parentId) {
      const parentCategory = await Category.findOne({
        where: { id: parentId },
        attributes: ["id", "categoryName", "parentId"],
        include: [
          {
            model: ImageCategory,
            as: "ImageCategories",
            attributes: ["imageUrl"],
          },
        ],
      });
      if (parentCategory) {
        path.unshift({
          categoryId: parentCategory.id,
          categoryName: parentCategory.categoryName,
        });
        if (parentCategory.ImageCategories) {
          imageUrls.push(
            ...parentCategory.ImageCategories.map((img) => img.imageUrl)
          );
        }
        parentId = parentCategory.parentId;
      } else {
        break;
      }
    }

    for (const child of category.children) {
      if (child.ImageCategories) {
        imageUrls.push(...child.ImageCategories.map((img) => img.imageUrl));
      }
    }
    if (category.children && category.children.length > 0) {
      continue;
    }
    const categoryData = {
      categoryId: category.id,
      categoryName: category.categoryName,
      toggle: category.toggle,
      updatedAt: category.updatedAt,
      images: imageUrls,
      path: [
        ...path,
        {
          categoryId: category.id,
          categoryName: category.categoryName,
        },
      ],
    };
    allCategories.push(categoryData);
  }

  return allCategories;
};

const getCategoriesData = async (categoryId) => {
  const category = await Category.findOne({
    where: { id: categoryId },
    include: [
      {
        model: Category,
        as: "parent",
        attributes: ["id", "categoryName"],
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
    images: await getAllImagesParentAndChildren(categoryId),
    path: await getCategoryPath(category),
  };
  return categoryData;
};
const getCategoryPath = async (category) => {
  const path = [];
  let currentCategory = category;
  while (currentCategory) {
    path.unshift({
      categoryId: currentCategory.id,
      categoryName: currentCategory.categoryName,
    });

    if (currentCategory.parentId) {
      currentCategory = await Category.findOne({
        where: { id: currentCategory.parentId },
      });
    } else {
      currentCategory = null;
    }
  }
  return path;
};
const getAllImagesParentAndChildren = async (categoryId) => {
  const allImagesSet = new Set();
  const fetchCategoryImages = async (id) => {
    const category = await Category.findOne({
      where: { id },
      include: [
        {
          model: ImageCategory,
          as: "ImageCategories",
          attributes: ["imageUrl"],
        },
        {
          model: Category,
          as: "children",
          attributes: ["id"],
        },
      ],
    });

    if (category) {
      category.ImageCategories.forEach((img) => allImagesSet.add(img.imageUrl));

      for (const child of category.children) {
        await fetchCategoryImages(child.id);
      }
    }
  };
  await fetchCategoryImages(categoryId);
  const fetchParentImages = async (id) => {
    const category = await Category.findOne({
      where: { id },
      include: [
        {
          model: ImageCategory,
          as: "ImageCategories",
          attributes: ["imageUrl"],
        },
        {
          model: Category,
          as: "parent",
          attributes: ["id"],
        },
      ],
    });

    if (category) {
      category.ImageCategories.forEach((img) => allImagesSet.add(img.imageUrl));

      if (category.parent) {
        await fetchParentImages(category.parent.id);
      }
    }
  };

  await fetchParentImages(categoryId);

  return Array.from(allImagesSet);
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
    await Transaction.rollback();
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
};
