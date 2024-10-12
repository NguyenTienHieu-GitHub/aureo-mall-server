const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const Inventory = require("../models/InventoryModel");
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

    if (Array.isArray(mediaList) && mediaList.length > 0) {
      const mediaData = mediaList.map((item) => ({
        productId: newProduct.id,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
        isFeatured: item.isFeatured,
      }));
      await ProductMedia.bulkCreate(mediaData, { transaction });
    }

    if (Array.isArray(optionList) && optionList.length > 0) {
      const optionData = optionList.map((option) => ({
        productId: newProduct.id,
        optionName: option.optionName,
        optionValue: option.optionValue,
      }));
      await ProductOption.bulkCreate(optionData, { transaction });
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
          attributes: ["optionName", "optionValue"],
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
  mediaList,
  optionList,
  quantity,
}) => {
  const product = await Product.findOne({ where: { slug: slug } });
  if (!product) {
    throw new Error("Product not found");
  }
  const transaction = await sequelize.transaction();
  try {
    const newSlug = await generateSlug(productName);
    await Product.update(
      {
        productName,
        description,
        slug: newSlug,
      },
      { where: { slug: slug }, transaction }
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
    if (Array.isArray(mediaList) && mediaList.length > 0) {
      const mediaData = mediaList.map((item) => ({
        productId: product.id,
        mediaType: item.mediaType,
        mediaUrl: item.mediaUrl,
      }));
      await ProductMedia.bulkCreate(mediaData, {
        updateOnDuplicate: ["mediaType", "mediaUrl"],
        transaction,
      });
    }

    if (Array.isArray(optionList) && optionList.length > 0) {
      const optionData = optionList.map((option) => ({
        productId: product.id,
        optionName: option.optionName,
        optionValue: option.optionValue,
      }));
      await ProductOption.bulkCreate(optionData, {
        updateOnDuplicate: ["optionName", "optionValue"],
        transaction,
      });
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
