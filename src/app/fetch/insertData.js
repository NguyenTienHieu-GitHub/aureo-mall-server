const fetch = require("node-fetch");

async function fetchAndInsertData() {
  try {
    // Fetch dữ liệu từ API
    const response = await fetch(
      "https://hongotheme.myshopify.com/nl/products/relaxed-fit-t-shirt.js"
    );
    const products = await response.json();

    // Duyệt qua từng sản phẩm và chèn vào cơ sở dữ liệu
    for (const product of products) {
      // Chèn sản phẩm vào bảng products
      await client.query(
        `INSERT INTO products (id, title, handle, description, vendor, type, tags, price, price_min, price_max, available, price_varies, compare_at_price, compare_at_price_min, compare_at_price_max, compare_at_price_varies, published_at, created_at, url)
           VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`,
        [
          product.id,
          product.title,
          product.handle,
          product.description,
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
          product.published_at,
          product.created_at,
          product.url,
        ]
      );

      // Chèn các biến thể sản phẩm vào bảng product_variants
      for (const variant of product.variants) {
        await client.query(
          `INSERT INTO product_variants (id, product_id, title, option1, option2, option3, sku, requires_shipping, taxable, price, weight, compare_at_price, inventory_management, barcode, available, featured_image_url)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)`,
          [
            variant.id,
            product.id,
            variant.title,
            variant.option1,
            variant.option2,
            variant.option3,
            variant.sku,
            variant.requires_shipping,
            variant.taxable,
            variant.price,
            variant.weight,
            variant.compare_at_price,
            variant.inventory_management,
            variant.barcode,
            variant.available,
            variant.featured_image_url,
          ]
        );
      }

      // Chèn các hình ảnh sản phẩm vào bảng product_images
      for (const image of product.images) {
        await client.query(
          `INSERT INTO product_images (id, product_id, url) VALUES ($1, $2, $3)`,
          [image.id, product.id, image.url]
        );
      }

      // Chèn các tùy chọn sản phẩm vào bảng product_options
      for (const option of product.options) {
        await client.query(
          `INSERT INTO product_options (product_id, name, position, values) VALUES ($1, $2, $3, $4)`,
          [product.id, option.name, option.position, option.values]
        );
      }
    }

    console.log("Dữ liệu đã được chèn vào cơ sở dữ liệu thành công!");
  } catch (error) {
    console.error("Lỗi khi fetch hoặc chèn dữ liệu:", error);
  } finally {
    // Đóng kết nối với cơ sở dữ liệu
    client.end();
  }
}

module.exports = {
  fetchAndInsertData,
};
