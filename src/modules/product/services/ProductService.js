const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const ProductOptionValue = require("../models/ProductOptionValueModel");
const {
  ProductRating,
  ProductRatingMedia,
} = require("../models/ProductRatingModel");
const Inventory = require("../models/InventoryModel");
const { Category } = require("../models/CategoryModel");
const ProductCategory = require("../models/ProductCategoryModel");
const Warehouse = require("../models/WarehouseModel");
const Shop = require("../models/ShopModel");
const slugify = require("slugify");
const { uploadFilesToCloudinary } = require("../../../shared/utils/upload");
const { Op } = require("sequelize");
const sequelize = require("../../../config/db/index");
const { User } = require("../../models");

const generateSlug = async (productName, existingSlug = null) => {
  const baseSlug = slugify(productName, { lower: true });
  let slug = baseSlug;
  let index = 1;

  while (
    existingSlug === slug ||
    (await Product.findOne({ where: { slug } }))
  ) {
    slug = `${baseSlug}-${index}`;
    index++;
  }

  return slug;
};

Product.beforeUpdate(async (product) => {
  if (product.productName) {
    product.slug = await generateSlug(product.productName, product.slug);
  }
});

const calculateAverageRating = async (productId) => {
  const ratings = await ProductRating.findAll({
    where: { productId: productId },
  });
  const totalRatings = ratings.length;
  let averageRating = 0;
  if (totalRatings > 0) {
    const sumRatings = ratings.reduce((sum, rating) => sum + rating.rating, 0);
    averageRating = sumRatings / totalRatings;
  }
  return averageRating.toFixed(1);
};
const generateSKU = (productName) => {
  const nameAbbreviation = productName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "")
    .substring(0, 3)
    .toUpperCase();

  const currentDate = new Date();
  const year = currentDate.getFullYear().toString().slice(2);
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const datePart = `${year}${month}${day}`;

  const randomNumber = Math.floor(1000 + Math.random() * 9000);
  const sku = `${nameAbbreviation}-${datePart}-${randomNumber}`;
  return sku;
};
const getAllProducts = async () => {
  const products = await Product.findAll({
    include: [
      {
        model: ProductPrice,
        as: "ProductPrice",
        attributes: [
          "finalPrice",
          "originalPrice",
          "discountPrice",
          "discountType",
          "discountStartDate",
          "discountEndDate",
        ],
      },
      {
        model: Category,
        attributes: ["categoryName", "id", "parentId"],
        through: { attributes: [] },
        include: {
          model: Category,
          as: "parent",
          attributes: ["categoryName", "id", "parentId"],
        },
      },
      {
        model: Inventory,
        as: "Inventory",
        attributes: ["quantity"],
      },
      {
        model: ProductMedia,
        attributes: ["mediaUrl", "isFeatured"],
      },
      {
        model: ProductOption,
        attributes: ["optionName"],
        include: [
          {
            model: ProductOptionValue,
            attributes: ["optionValue"],
          },
        ],
      },
      {
        model: Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
    ],
  });
  if (products.length === 0) {
    throw new Error("Product not found");
  }
  const formattedProducts = await Promise.all(
    products.map(async (productData) => {
      const averageRating = await calculateAverageRating(productData.id);
      const categoryList = [];
      if (productData.Categories && productData.Categories.length > 0) {
        productData.Categories.forEach((category) => {
          const buildCategoryList = (cat) => {
            if (cat) {
              categoryList.unshift({
                id: cat.id,
                categoryName: cat.categoryName,
              });
              if (cat.parent) buildCategoryList(cat.parent);
            }
          };
          buildCategoryList(category);
        });
      }
      return {
        sku: productData.sku,
        productId: productData.id,
        averageRating: averageRating,
        shopName: productData.Shop.shopName,
        productName: productData.productName,
        originalPrice: productData.ProductPrice.originalPrice,
        discountPrice: productData.ProductPrice.discountPrice,
        discountType: productData.ProductPrice.discountType,
        discountStartDate: productData.ProductPrice.discountStartDate,
        discountEndDate: productData.ProductPrice.discountEndDate,
        finalPrice: productData.ProductPrice.finalPrice,
        description: productData.description,
        categoryList: categoryList,
        mediaList: productData.ProductMedia,
        optionList: productData.ProductOptions
          ? productData.ProductOptions.map((productOption) => ({
              optionName: productOption.optionName,
              optionValues: productOption.ProductOptionValues
                ? productOption.ProductOptionValues.map(
                    (optionValue) => optionValue.optionValue
                  )
                : [],
            }))
          : [],
        quantity: productData.quantity,
        slug: productData.slug,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      };
    })
  );
  return formattedProducts;
};
const createProduct = async ({
  userId,
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
}) => {
  const shop = await Shop.findOne({
    where: {
      userId: userId,
    },
    attributes: ["id", "shopName"],
  });
  if (!shop) {
    throw new Error("You need to create a store before creating products");
  }
  const transaction = await sequelize.transaction();
  try {
    const slug = await generateSlug(productName);
    const sku = generateSKU(productName);
    const newProduct = await Product.create(
      {
        shopId: shop.id,
        productName,
        sku: sku,
        description,
        slug: slug,
      },
      { transaction }
    );
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    if (categoryId) {
      await ProductCategory.create(
        {
          productId: newProduct.id,
          categoryId: categoryId,
        },
        { transaction }
      );
    }
    const uploadedMedia = await uploadFilesToCloudinary(
      mediaList,
      productName,
      "products"
    );
    if (uploadedMedia && uploadedMedia.length > 0) {
      await Promise.all(
        uploadedMedia.map((mediaItem, index) =>
          ProductMedia.create(
            {
              productId: newProduct.id,
              mediaUrl: mediaItem,
              isFeatured: index === 0,
            },
            { transaction }
          )
        )
      );
    }
    const optionLists = JSON.parse(optionList);
    for (const option of optionLists) {
      if (!option.optionName) {
        throw new Error("Option name is required.");
      }
      const productOption = await ProductOption.create(
        {
          productId: newProduct.id,
          optionName: option.optionName,
        },
        { transaction }
      );
      const optionValues = option.optionValues;
      await ProductOptionValue.bulkCreate(
        optionValues.map((value) => ({
          optionId: productOption.id,
          optionValue: value,
        })),
        { transaction }
      );
    }

    await Inventory.create(
      {
        productId: newProduct.id,
        quantity,
      },
      { transaction }
    );
    await ProductPrice.create(
      {
        productId: newProduct.id,
        originalPrice,
        discountPrice,
        discountType,
        discountStartDate,
        discountEndDate,
      },
      { transaction }
    );
    await transaction.commit();
    const productData = await Product.findOne({
      where: { id: newProduct.id },
      include: [
        {
          model: ProductPrice,
          as: "ProductPrice",
          attributes: [
            "originalPrice",
            "discountPrice",
            "discountType",
            "discountStartDate",
            "discountEndDate",
            "finalPrice",
          ],
        },
        {
          model: Inventory,
          as: "Inventory",
          attributes: ["quantity"],
        },
        {
          model: ProductMedia,
          attributes: ["mediaUrl", "isFeatured"],
        },
        {
          model: ProductOption,
          attributes: ["optionName"],
          include: [
            {
              model: ProductOptionValue,
              attributes: ["optionValue"],
            },
          ],
        },
        {
          model: Category,
          attributes: ["categoryName", "id", "parentId"],
          through: { attributes: [] },
          include: {
            model: Category,
            as: "parent",
            attributes: ["categoryName", "id", "parentId"],
          },
        },
        {
          model: Shop,
          as: "Shop",
          attributes: ["shopName"],
        },
      ],
    });
    if (!productData) {
      throw new Error("Product not found");
    }
    const categoryList = [];
    if (productData.Categories && productData.Categories.length > 0) {
      productData.Categories.forEach((category) => {
        const buildCategoryList = (cat) => {
          if (cat) {
            categoryList.unshift({
              id: cat.id,
              categoryName: cat.categoryName,
            });
            if (cat.parent) buildCategoryList(cat.parent);
          }
        };
        buildCategoryList(category);
      });
    }
    const averageRating = await calculateAverageRating(productData.id);
    const responseData = {
      sku: productData.sku,
      productId: productData.id,
      shopName: productData.Shop.shopName,
      productName: productData.productName,
      averageRating: averageRating,
      originalPrice: productData.ProductPrice.originalPrice,
      discountPrice: productData.ProductPrice.discountPrice,
      discountType: productData.ProductPrice.discountType,
      discountStartDate: productData.ProductPrice.discountStartDate,
      discountEndDate: productData.ProductPrice.discountEndDate,
      finalPrice: productData.ProductPrice.finalPrice,
      description: productData.description,
      categoryList: categoryList,
      mediaList: productData.ProductMedia,
      optionList: Array.isArray(productData.ProductOptions)
        ? productData.ProductOptions.map((option) => ({
            optionName: option.optionName,
            optionValues: Array.isArray(option.ProductOptionValues)
              ? option.ProductOptionValues.map((value) => value.optionValue)
              : [],
          }))
        : [],
      quantity: productData.quantity,
      slug: productData.slug,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
    return responseData;
  } catch (err) {
    if (transaction.finished !== "commit") {
      await transaction.rollback();
    }
    throw new Error(err.message);
  }
};
const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ where: { slug: slug } });
  if (!product) {
    throw new Error("Product not found");
  }
  const productData = await Product.findOne({
    where: { id: product.id },
    include: [
      {
        model: ProductPrice,
        as: "ProductPrice",
        attributes: [
          "finalPrice",
          "originalPrice",
          "discountPrice",
          "discountType",
          "discountStartDate",
          "discountEndDate",
        ],
      },
      {
        model: Inventory,
        as: "Inventory",
        attributes: ["quantity"],
      },
      {
        model: ProductMedia,
        attributes: ["mediaUrl", "isFeatured"],
      },
      {
        model: ProductOption,
        attributes: ["optionName"],
        include: [
          {
            model: ProductOptionValue,
            attributes: ["optionValue"],
          },
        ],
      },
      {
        model: Category,
        attributes: ["categoryName", "id", "parentId"],
        through: { attributes: [] },
        include: {
          model: Category,
          as: "parent",
          attributes: ["categoryName", "id", "parentId"],
        },
      },
      {
        model: Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
    ],
  });
  if (!productData) {
    throw new Error("Product not found");
  }
  const categoryList = [];
  if (productData.Categories && productData.Categories.length > 0) {
    productData.Categories.forEach((category) => {
      const buildCategoryList = (cat) => {
        if (cat) {
          categoryList.unshift({
            id: cat.id,
            categoryName: cat.categoryName,
          });
          if (cat.parent) buildCategoryList(cat.parent);
        }
      };
      buildCategoryList(category);
    });
  }
  const averageRating = await calculateAverageRating(productData.id);

  const responseData = {
    sku: productData.sku,
    productId: productData.id,
    shopName: productData.Shop.shopName,
    productName: productData.productName,
    averageRating: averageRating,
    originalPrice: productData.ProductPrice.originalPrice,
    discountPrice: productData.ProductPrice.discountPrice,
    discountType: productData.ProductPrice.discountType,
    discountStartDate: productData.ProductPrice.discountStartDate,
    discountEndDate: productData.ProductPrice.discountEndDate,
    finalPrice: productData.ProductPrice.finalPrice,
    description: productData.description,
    categoryList: categoryList,
    mediaList: productData.ProductMedia,
    optionList: Array.isArray(productData.ProductOptions)
      ? productData.ProductOptions.map((option) => ({
          optionName: option.optionName,
          optionValues: Array.isArray(option.ProductOptionValues)
            ? option.ProductOptionValues.map((value) => value.optionValue)
            : [],
        }))
      : [],
    quantity: productData.quantity,
    slug: productData.slug,
    createdAt: productData.createdAt,
    updatedAt: productData.updatedAt,
  };
  return responseData;
};
const updateProduct = async ({
  slug,
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
}) => {
  const transaction = await sequelize.transaction();
  try {
    const product = await Product.findOne({ where: { slug } });
    if (!product) {
      throw new Error("Product not found");
    }
    const skuToUpdate = product.sku;
    if (product.productName !== productName) {
      const newSlug = await generateSlug(productName);
      await product.update(
        { productName, sku: skuToUpdate, description, slug: newSlug },
        { transaction }
      );
    } else {
      await product.update({ description }, { transaction });
    }
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new Error("Category not found");
    }
    await ProductCategory.update(
      { categoryId },
      { where: { productId: product.id }, transaction }
    );

    await ProductPrice.update(
      {
        originalPrice,
        discountPrice,
        discountType,
        discountStartDate,
        discountEndDate,
      },
      { where: { productId: product.id }, transaction }
    );

    await ProductMedia.destroy(
      {
        where: { productId: product.id },
      },
      { transaction }
    );

    const uploadedMedia = await uploadFilesToCloudinary(
      mediaList,
      productName,
      "products"
    );
    if (uploadedMedia && uploadedMedia.length > 0) {
      await Promise.all(
        uploadedMedia.map((mediaItem, index) =>
          ProductMedia.create(
            {
              productId: product.id,
              mediaUrl: mediaItem,
              isFeatured: index === 0,
            },
            { transaction }
          )
        )
      );
    }
    await ProductOption.destroy(
      { where: { productId: product.id } },
      { transaction }
    );
    const optionLists = JSON.parse(optionList);
    for (const option of optionLists) {
      if (!option.optionName) {
        throw new Error("Option name is required.");
      }
      const productOption = await ProductOption.create(
        {
          productId: product.id,
          optionName: option.optionName,
        },
        { transaction }
      );
      const optionValue = option.optionValues;
      await ProductOptionValue.bulkCreate(
        optionValue.map((value) => ({
          optionId: productOption.id,
          optionValue: value,
        })),
        { transaction }
      );
    }

    await Inventory.update(
      { quantity },
      { where: { productId: product.id }, transaction }
    );

    await transaction.commit();

    const productData = await Product.findOne({
      where: { id: product.id },
      include: [
        {
          model: ProductPrice,
          as: "ProductPrice",
          attributes: [
            "finalPrice",
            "originalPrice",
            "discountPrice",
            "discountType",
            "discountStartDate",
            "discountEndDate",
          ],
        },
        {
          model: Inventory,
          as: "Inventory",
          attributes: ["quantity"],
        },
        {
          model: ProductMedia,
          attributes: ["mediaUrl", "isFeatured"],
        },
        {
          model: ProductOption,
          attributes: ["optionName"],
          include: [
            {
              model: ProductOptionValue,
              attributes: ["optionValue"],
            },
          ],
        },
        {
          model: Category,
          attributes: ["categoryName", "id", "parentId"],
          through: { attributes: [] },
          include: {
            model: Category,
            as: "parent",
            attributes: ["categoryName", "id", "parentId"],
          },
        },
        {
          model: Shop,
          as: "Shop",
          attributes: ["shopName"],
        },
      ],
    });

    if (!productData) {
      throw new Error("Product not found");
    }
    const categoryList = [];
    if (productData.Categories && productData.Categories.length > 0) {
      productData.Categories.forEach((category) => {
        const buildCategoryList = (cat) => {
          if (cat) {
            categoryList.unshift({
              id: cat.id,
              categoryName: cat.categoryName,
            });
            if (cat.parent) buildCategoryList(cat.parent);
          }
        };
        buildCategoryList(category);
      });
    }
    const averageRating = await calculateAverageRating(productData.id);

    const responseData = {
      sku: productData.sku,
      productId: productData.id,
      shopName: productData.Shop.shopName,
      productName: productData.productName,
      averageRating: averageRating,
      originalPrice: productData.ProductPrice.originalPrice,
      discountPrice: productData.ProductPrice.discountPrice,
      discountType: productData.ProductPrice.discountType,
      discountStartDate: productData.ProductPrice.discountStartDate,
      discountEndDate: productData.ProductPrice.discountEndDate,
      finalPrice: productData.ProductPrice.finalPrice,
      description: productData.description,
      categoryList: categoryList,
      mediaList: productData.ProductMedia,
      optionList: Array.isArray(productData.ProductOptions)
        ? productData.ProductOptions.map((option) => ({
            optionName: option.optionName,
            optionValues: Array.isArray(option.ProductOptionValues)
              ? option.ProductOptionValues.map((value) => value.optionValue)
              : [],
          }))
        : [],
      quantity: productData.quantity,
      slug: productData.slug,
      createdAt: productData.createdAt,
      updatedAt: productData.updatedAt,
    };
    return responseData;
  } catch (err) {
    if (transaction.finished !== "commit") {
      await transaction.rollback();
    }
    throw new Error(err.message);
  }
};

const deleteProduct = async (slug) => {
  const product = await Product.findOne({ where: { slug: slug } });
  if (!product) {
    throw new Error("Product not found");
  }
  await Product.destroy({
    where: { slug: product.slug },
  });
};
const removeVietnameseTones = (str) => {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
};
const searchByNameProduct = async ({ searchItems }) => {
  const normalizedSearchTerm = removeVietnameseTones(searchItems);
  const newSlug = await generateSlug(normalizedSearchTerm);
  const productData = await Product.findAll({
    where: {
      slug: {
        [Op.iLike]: `%${newSlug}%`,
      },
    },
    include: [
      {
        model: ProductPrice,
        as: "ProductPrice",
        attributes: [
          "finalPrice",
          "originalPrice",
          "discountPrice",
          "discountType",
          "discountStartDate",
          "discountEndDate",
        ],
      },
      {
        model: Inventory,
        as: "Inventory",
        attributes: ["quantity"],
      },
      {
        model: ProductMedia,
        attributes: ["mediaUrl", "isFeatured"],
      },
      {
        model: ProductOption,
        attributes: ["optionName"],
        include: [
          {
            model: ProductOptionValue,
            attributes: ["optionValue"],
          },
        ],
      },
      {
        model: Category,
        attributes: ["categoryName", "id", "parentId"],
        through: { attributes: [] },
        include: {
          model: Category,
          as: "parent",
          attributes: ["categoryName", "id", "parentId"],
        },
      },
      {
        model: Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
    ],
  });
  if (productData.length === 0) {
    throw new Error("Product not found");
  }
  const formattedProducts = Promise.all(
    productData.map(async (productData) => {
      const averageRating = await calculateAverageRating(productData.id);
      const categoryList = [];
      if (productData.Categories && productData.Categories.length > 0) {
        productData.Categories.forEach((category) => {
          const buildCategoryList = (cat) => {
            if (cat) {
              categoryList.unshift({
                id: cat.id,
                categoryName: cat.categoryName,
              });
              if (cat.parent) buildCategoryList(cat.parent);
            }
          };
          buildCategoryList(category);
        });
      }
      return {
        sku: productData.sku,
        productId: productData.id,
        shopName: productData.Shop.shopName,
        productName: productData.productName,
        averageRating: averageRating,
        originalPrice: productData.ProductPrice.originalPrice,
        discountPrice: productData.ProductPrice.discountPrice,
        discountType: productData.ProductPrice.discountType,
        discountStartDate: productData.ProductPrice.discountStartDate,
        discountEndDate: productData.ProductPrice.discountEndDate,
        finalPrice: productData.ProductPrice.finalPrice,
        description: productData.description,
        categoryList: categoryList,
        mediaList: productData.ProductMedia,
        optionList: productData.ProductOptions
          ? productData.ProductOptions.map((productOption) => ({
              optionName: productOption.optionName,
              optionValues: productOption.ProductOptionValues
                ? productOption.ProductOptionValues.map(
                    (optionValue) => optionValue.optionValue
                  )
                : [],
            }))
          : [],
        quantity: productData.quantity,
        slug: productData.slug,
        createdAt: productData.createdAt,
        updatedAt: productData.updatedAt,
      };
    })
  );
  return formattedProducts;
};
const getProductById = async (productId) => {
  const productData = await Product.findOne({
    where: { id: productId },
    include: [
      {
        model: ProductPrice,
        as: "ProductPrice",
        attributes: [
          "finalPrice",
          "originalPrice",
          "discountPrice",
          "discountType",
          "discountStartDate",
          "discountEndDate",
        ],
      },
      {
        model: Inventory,
        as: "Inventory",
        attributes: ["quantity"],
      },
      {
        model: ProductMedia,
        attributes: ["mediaUrl", "isFeatured"],
      },
      {
        model: ProductOption,
        attributes: ["optionName"],
        include: [
          {
            model: ProductOptionValue,
            attributes: ["optionValue"],
          },
        ],
      },
      {
        model: Category,
        attributes: ["categoryName", "id", "parentId"],
        through: { attributes: [] },
        include: {
          model: Category,
          as: "parent",
          attributes: ["categoryName", "id", "parentId"],
        },
      },
      {
        model: Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
    ],
  });
  if (!productData) {
    throw new Error("Product not found");
  }
  const categoryList = [];
  if (productData.Categories && productData.Categories.length > 0) {
    productData.Categories.forEach((category) => {
      const buildCategoryList = (cat) => {
        if (cat) {
          categoryList.unshift({
            id: cat.id,
            categoryName: cat.categoryName,
          });
          if (cat.parent) buildCategoryList(cat.parent);
        }
      };
      buildCategoryList(category);
    });
  }
  const averageRating = await calculateAverageRating(productData.id);
  const responseData = {
    sku: productData.sku,
    productId: productData.id,
    shopName: productData.Shop.shopName,
    productName: productData.productName,
    averageRating: averageRating,
    originalPrice: productData.ProductPrice.originalPrice,
    discountPrice: productData.ProductPrice.discountPrice,
    discountType: productData.ProductPrice.discountType,
    discountStartDate: productData.ProductPrice.discountStartDate,
    discountEndDate: productData.ProductPrice.discountEndDate,
    finalPrice: productData.ProductPrice.finalPrice,
    description: productData.description,
    categoryList: categoryList,
    mediaList: productData.ProductMedia,
    optionList: Array.isArray(productData.ProductOptions)
      ? productData.ProductOptions.map((option) => ({
          optionName: option.optionName,
          optionValues: Array.isArray(option.ProductOptionValues)
            ? option.ProductOptionValues.map((value) => value.optionValue)
            : [],
        }))
      : [],
    quantity: productData.quantity,
    slug: productData.slug,
    createdAt: productData.createdAt,
    updatedAt: productData.updatedAt,
  };
  return responseData;
};

const createRatingProduct = async ({
  productId,
  userId,
  rating,
  comment,
  mediaUrl,
}) => {
  const transaction = await sequelize.transaction();
  try {
    const findProduct = await Product.findByPk(productId);
    if (!findProduct) {
      throw new Error("Product not found");
    }
    if (rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }
    const createRating = await ProductRating.create(
      {
        productId: findProduct.id,
        userId: userId,
        rating,
        comment,
      },
      { transaction }
    );
    const uploadedMedia = await uploadFilesToCloudinary(
      mediaUrl,
      findProduct.productName,
      "ratings"
    );
    if (uploadedMedia && uploadedMedia.length > 0) {
      await Promise.all(
        uploadedMedia.map((mediaItem) =>
          ProductRatingMedia.create(
            {
              ratingId: createRating.id,
              mediaUrl: mediaItem,
            },
            { transaction }
          )
        )
      );
    }
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw new Error(error.message);
  }
};
const getAllRatingOfProduct = async (productId) => {
  try {
    const findProduct = await Product.findByPk(productId);
    if (!findProduct) {
      throw new Error("Product not found");
    }
    const rating = await ProductRating.findAll({
      where: { productId: findProduct.id },
      include: [
        {
          model: Product,
          as: "Product",
          attributes: ["id"],
        },
        {
          model: User,
          as: "User",
          attributes: ["id", "avatar", "firstName", "lastName"],
        },
        {
          model: ProductRatingMedia,
          as: "Media",
          attributes: ["mediaUrl"],
        },
      ],
    });
    if (rating.length === 0) {
      throw new Error("Product is not rating");
    }
    const formattedRatingData = rating.map((ratingData) => {
      return {
        ratingId: ratingData.id,
        userId: ratingData.User.id,
        avatar: ratingData.User.avatar,
        productId: ratingData.Product.id,
        fullName: `${ratingData.User.firstName} ${ratingData.User.lastName}`,
        rating: ratingData.rating,
        comment: ratingData.comment,
        mediaUrls: ratingData.Media?.map((media) => media.mediaUrl) || [],
        createdAt: ratingData.createdAt,
        updatedAt: ratingData.updatedAt,
      };
    });
    return formattedRatingData;
  } catch (error) {
    throw new Error(error.message);
  }
};
module.exports = {
  generateSlug,
  getAllProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
  searchByNameProduct,
  getProductById,
  createRatingProduct,
  getAllRatingOfProduct,
};
