const Banner = require("../models/BannerModel");
const Product = require("../../product/models/ProductModel");
const ProductPrice = require("../../product/models/ProductPriceModel");
const ProductMedia = require("../../product/models/ProductMediaModel");
const setResponseLocals = require("../../../shared/middleware/setResponseLocals");
const sequelize = require("../../../config/db/index");
const { uploadImageToCloudinary } = require("../../../shared/utils/upload");
const getBanners = async (req, res) => {
  try {
    const banners = await Banner.findAll({
      attributes: ["id", "title", "imageUrl", "ctaText", "ctaUrl"],
      order: [["createdAt", "DESC"]],
    });

    const products = await Product.findAll({
      attributes: ["id", "productName"],
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
          model: ProductMedia,
          attributes: ["mediaUrl"],
        },
      ],
      order: sequelize.literal("random()"),
      limit: 2,
    });
    const formattedResponse = {
      banners: banners.map((banner) => ({
        id: banner.id,
        title: banner.title,
        imageUrl: banner.imageUrl,
        button: banner.ctaText,
        redirectUrl: banner.ctaUrl,
      })),
      randomProducts: products.map((product) => ({
        id: product.id,
        productName: product.productName,
        finalPrice: product.ProductPrice?.finalPrice || null,
        mediaUrl:
          product.ProductMedia.find((media) => media.isFeatured)?.mediaUrl ||
          product.ProductMedia[0]?.mediaUrl ||
          null,
      })),
    };

    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Banners and random products retrieved successfully",
      data: formattedResponse,
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message || "Something went wrong",
    });
  }
};

const createBanner = async (req, res) => {
  const { path } = req.file;
  const { title, ctaText, ctaUrl } = req.body;
  try {
    const banners = await uploadImageToCloudinary(path, title, "banners");
    const newBanner = await Banner.create({
      title,
      imageUrl: banners,
      ctaText,
      ctaUrl,
    });
    return setResponseLocals({
      res,
      statusCode: 201,
      messageSuccess: "Create banner successfully",
      data: newBanner,
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};

const updateBanner = async (req, res) => {
  try {
    const { path } = req.file;
    const { id } = req.params;
    const { title, ctaText, ctaUrl } = req.body;

    const banner = await Banner.findByPk(id);
    if (!banner) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "BANNER_NOT_FOUND",
        errorMessage: "Banner not found",
      });
    }
    const banners = await uploadImageToCloudinary(path, title, "banners");
    await banner.update({ title, imageUrl: banners, ctaText, ctaUrl });
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Updated banner successfully",
      data: banner,
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};

const deleteBanner = async (req, res) => {
  try {
    const { id } = req.params;
    const banner = await Banner.findByPk(id);
    if (!banner) {
      return setResponseLocals({
        res,
        statusCode: 404,
        errorCode: "BANNER_NOT_FOUND",
        errorMessage: "Banner not found",
      });
    }

    await banner.destroy();
    return setResponseLocals({
      res,
      statusCode: 200,
      messageSuccess: "Banner deleted successfully",
    });
  } catch (error) {
    return setResponseLocals({
      res,
      statusCode: 500,
      errorCode: "INTERNAL_SERVER_ERROR",
      errorMessage: error.message,
    });
  }
};

module.exports = { getBanners, createBanner, updateBanner, deleteBanner };
