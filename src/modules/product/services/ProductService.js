const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const ProductOptionValue = require("../models/ProductOptionValueModel");
const Inventory = require("../models/InventoryModel");
const Category = require("../models/CategoryModel");
const ProductCategory = require("../models/ProductCategoryModel");
const Warehouse = require("../models/WarehouseModel");
const Shop = require("../models/ShopModel");
const slugify = require("slugify");
const sequelize = require("../../../config/db/index");

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
        attributes: ["categoryName"],
      },
      {
        model: Inventory,
        as: "Inventory",
        attributes: ["quantity"],
      },
      {
        model: ProductMedia,
        attributes: ["mediaType", "mediaUrl"],
      },
      {
        model: ProductOption,
        attributes: ["optionName", "optionValue"],
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
  const formattedProducts = products.map((product) => {
    return {
      shopName: product.Shop?.shopName,
      productName: product.productName,
      originalPrice: product.ProductPrice[0]?.originalPrice,
      discountPrice: product.ProductPrice[0]?.discountPrice,
      discountType: product.ProductPrice[0]?.discountType,
      discountStartDate: product.ProductPrice[0]?.discountStartDate,
      discountEndDate: product.ProductPrice[0]?.discountEndDate,
      finalPrice: product.ProductPrice[0]?.finalPrice,
      description: product.description,
      categoryList:
        product.Categories?.map((category) => category.categoryName) || [],
      mediaList: product.ProductMedia,
      optionList: product.ProductOptions,
      quantity: product.Inventory[0]?.quantity,
      slug: product.slug,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    };
  });
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
    const newProduct = await Product.create(
      {
        shopId: shop.id,
        productName,
        description,
        slug: slug,
      },
      { transaction }
    );
    if (categoryId) {
      await ProductCategory.create(
        {
          productId: newProduct.id,
          categoryId: categoryId,
        },
        { transaction }
      );
    }

    if (Array.isArray(mediaList) && mediaList.length > 0) {
      const mediaData = mediaList.map((item) => ({
        productId: newProduct.id,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        isFeatured: item.isFeatured,
      }));
      await ProductMedia.bulkCreate(mediaData, { transaction });
    }
    for (const optionName in optionList) {
      const option = await ProductOption.create(
        {
          productId: newProduct.id,
          optionName: optionName,
        },
        { transaction }
      );

      const values = optionList[optionName];
      await ProductOptionValue.bulkCreate(
        values.map((value) => ({
          optionId: option.id,
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
          attributes: ["mediaType", "mediaUrl", "isFeatured"],
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
          as: "Categories",
          attributes: ["categoryName"],
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
    return productData;
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
        attributes: ["mediaType", "mediaUrl"],
      },
      {
        model: ProductOption,
        attributes: ["optionName", "optionValue"],
      },
      {
        model: Shop,
        as: "Shop",
        attributes: ["shopName"],
      },
    ],
  });
  return productData;
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
    const product = await Product.findOne({ where: { slug }, transaction });
    if (!product) {
      throw new Error("Product not found");
    }
    if (product.productName !== productName) {
      const newSlug = await generateSlug(productName);
      await Product.update(
        {
          productName,
          description,
          slug: newSlug,
        },
        { where: { slug: slug }, transaction }
      );
    } else {
      await Product.update(
        {
          description,
        },
        { where: { slug }, transaction }
      );
    }
    if (categoryId) {
      await ProductCategory.update(
        {
          productId: product.id,
          categoryId: categoryId,
        },

        { where: { productId: product.id }, transaction }
      );
    }
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
    const mediaId = await ProductMedia.findAll({
      where: { productId: product.id },
      transaction,
    });
    for (const item of mediaList) {
      await ProductMedia.update(
        {
          id: mediaId.id,
          productId: product.id,
          mediaUrl: item.mediaUrl,
          mediaType: item.mediaType,
          isFeatured: item.isFeatured,
        },
        { where: { id: optionId }, transaction }
      );
    }
    const optionId = await ProductOption.findAll({
      where: { productId: product.id },
      transaction,
    });
    for (const option of optionList) {
      await ProductOption.update(
        {
          productId: product.id,
          optionName: option.optionName,
          optionValue: option.optionValue,
        },
        { where: { id: optionId }, transaction }
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
          attributes: ["mediaType", "mediaUrl"],
        },
        {
          model: ProductOption,
          attributes: ["optionName", "optionValue"],
        },
        {
          model: Category,
          attributes: ["categoryName"],
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
    return productData;
  } catch (err) {
    await transaction.rollback();
    console.error(err);
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
module.exports = {
  generateSlug,
  getAllProducts,
  createProduct,
  getProductBySlug,
  updateProduct,
  deleteProduct,
};
