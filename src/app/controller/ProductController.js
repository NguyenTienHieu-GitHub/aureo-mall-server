const fetch = require("node-fetch");
const pool = require("../../config/db/index");
const productModel = require("../../app/models/ProductModel");

const fetchAndInsertData = async () => {
  try {
    const response = await fetch(
      "https://hongotheme.myshopify.com/nl/products/relaxed-fit-t-shirt.js"
    );
    const data = await response.json();

    console.log("Dữ liệu nhận được từ API:", data);

    // Kiểm tra cấu trúc dữ liệu
    if (!data.products || !Array.isArray(data.products)) {
      throw new Error("Dữ liệu nhận được không chứa mảng sản phẩm.");
    }

    const products = data.products;

    for (const product of products) {
      // Chèn sản phẩm
      await pool.query(productModel.fetchDataProducts, [
        product.id,
        product.title,
        product.handle,
        product.description,
        product.published_at,
        product.created_at,
        product.vendor,
        product.type,
        product.tags,
        product.price,
        product.price_min,
        product.price_max,
        product.available,
        product.price_varies,
        product.compare_at_price,
        product.compare_at_price_min,
        product.compare_at_price_max,
        product.compare_at_price_varies,
        product.featured_image,
        product.url,
      ]);

      // Chèn các biến thể sản phẩm
      for (const variant of product.variants || []) {
        await pool.query(productModel.fetchDataProductVariants, [
          variant.id,
          variant.product_id,
          variant.title,
          variant.option1,
          variant.option2,
          variant.option3,
          variant.sku,
          variant.requires_shipping,
          variant.taxable,
          variant.featured_image,
          variant.available,
          variant.name,
          variant.public_title,
          variant.options,
          variant.price,
          variant.weight,
          variant.compare_at_price,
          variant.inventory_management,
          variant.barcode,
          variant.requires_selling_plan,
        ]);
      }

      // Chèn các hình ảnh sản phẩm
      for (const image of product.images || []) {
        await pool.query(productModel.fetchDataProductImages, [
          image.id,
          product.id,
          image.url,
          image.position,
          image.alt_text,
        ]);
      }

      // Chèn các tùy chọn sản phẩm
      for (const option of product.options || []) {
        await pool.query(productModel.fetchDataProductOptions, [
          product.id,
          option.name,
          option.value,
          option.position,
        ]);
      }

      // Chèn các phương tiện sản phẩm
      for (const media of product.media || []) {
        await pool.query(productModel.fetchDataProductMedia, [
          media.id,
          product.id,
          media.media_type,
          media.src, // Cập nhật từ media_url
          media.position,
          media.aspect_ratio,
          media.height,
          media.width,
        ]);
      }

      // Cập nhật phần chèn ảnh nổi bật
      for (const variant of product.variants || []) {
        await pool.query(productModel.fetchDataVariantsFeaturedImage, [
          variant.id,
          product.id,
          variant.featured_image && variant.featured_image.id, // Sử dụng đúng thuộc tính
          variant.position,
          variant.featured_image && variant.featured_image.alt, // Sử dụng đúng thuộc tính
          variant.featured_image && variant.featured_image.width, // Sử dụng đúng thuộc tính
          variant.featured_image && variant.featured_image.height, // Sử dụng đúng thuộc tính
          variant.featured_image && variant.featured_image.src, // Sử dụng đúng thuộc tính
        ]);
      }
    }

    console.log("Dữ liệu đã được chèn vào cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi khi fetch hoặc chèn dữ liệu:", error);
  }
};

module.exports = {
  fetchAndInsertData,
};
