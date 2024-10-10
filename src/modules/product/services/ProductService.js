const Product = require("../models/ProductModel");
const ProductPrice = require("../models/ProductPriceModel");
const ProductMedia = require("../models/ProductMediaModel");
const ProductOption = require("../models/ProductOptionModel");
const Inventory = require("../models/InventoryModel");
const Warehouse = require("../models/WarehouseModel");
const Shop = require("../models/ShopModel");
const slugify = require("slugify");
const sequelize = require("../../../config/db/index");

const getAllProducts = async () => {
  const getAllProducts = await Product.findAll({
    include: [
      {
        model: ProductPrice,
        attributes: ["price"],
      },
    ],
  });
  if (getAllProducts === 0) {
    throw new Error("Product not found");
  }
  return getAllProducts;
};
const createProduct = async ({
  userId,
  productName,
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
    const slug = slugify(productName, {
      lower: true,
      strict: true,
    });
    let existingProduct = await Product.findOne({
      where: { slug: slug },
    });

    let count = 1;
    while (existingProduct) {
      slug = slugify(`${productName}-${count}`, {
        lower: true,
        strict: true,
      });

      existingProduct = await Product.findOne({
        where: { slug: slug },
      });
      count++;
    }
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
    await transaction.commit();
    return newProduct;
  } catch (err) {
    await transaction.rollback();
    throw new Error(`Failed to create product: ${err.message}`);
  }
};
module.exports = {
  getAllProducts,
  createProduct,
};
