const fetchDataProducts = `INSERT INTO products (
      id, title, handle, description, published_at, created_at, vendor,
      type, tags, price, price_min, price_max, available, price_varies,
      compare_at_price, compare_at_price_min, compare_at_price_max,
      compare_at_price_varies, featured_image, url
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`;
const fetchDataProductVariants = `INSERT INTO product_variants (
      id, product_id, title, option1, option2, option3, sku, requires_shipping,
      taxable, featured_image, available, name, public_title, options,
      price, weight, compare_at_price, inventory_management, barcode,
      requires_selling_plan
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)`;
const fetchDataProductImages = `INSERT INTO product_images (
      id, product_id, image_url, position, alt_text
      ) VALUES ($1, $2, $3, $4, $5)`;
const fetchDataProductOptions = `INSERT INTO product_options (
      product_id, option_name, option_value, position
      ) VALUES ($1, $2, $3, $4)`;
const fetchDataProductMedia = `INSERT INTO product_media (
      id, product_id, media_type, media_url, position, aspect_ratio, height, width
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
const fetchDataVariantsFeaturedImage = `INSERT INTO variants_featured_image (id, product_id, variant_ids, position, alt, width, height, src) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`;
module.exports = {
  fetchDataProducts,
  fetchDataProductVariants,
  fetchDataProductImages,
  fetchDataProductOptions,
  fetchDataProductMedia,
  fetchDataVariantsFeaturedImage,
};
