const sequelize = require("../../config/db/index");
const createDefaultRoles = require("../../shared/utils/role");
const createDefaultPermission = require("../../shared//utils/permission");
const createDefaultRolePermission = require("../../shared//utils/rolePermission");
const createAdminIfNotExists = require("../../shared//utils/createAdmin");

const User = require("../auth/models/UserModel");
const Role = require("../auth/models/RoleModel");
const UserRole = require("../auth/models/UserRoleModel");
const Token = require("../auth/models/TokenModel");
const BlacklistToken = require("../auth/models/BlacklistTokenModel");

const Product = require("../product/models/ProductModel");
const { Category, ImageCategory } = require("../product/models/CategoryModel");
const ProductCategory = require("../product/models/ProductCategoryModel");
const ProductPrice = require("../product/models/ProductPriceModel");
const Shop = require("../shop/models/ShopModel");
const ShopAddress = require("../shop/models/ShopAddressModel");
const Inventory = require("../product/models/InventoryModel");
const Warehouse = require("../product/models/WarehouseModel");
const ProductMedia = require("../product/models/ProductMediaModel");
const ProductOption = require("../product/models/ProductOptionModel");
const ProductOptionValue = require("../product/models/ProductOptionValueModel");

const Promotion = require("../product/models/PromotionModel");
const ProductPromotion = require("../product/models/ProductPromotionModel");

const {
  ProductRating,
  ProductRatingMedia,
} = require("../product/models/ProductRatingModel");

const Cart = require("../cart/models/CartModel");
const CartItem = require("../cart/models/CartItemModel");

const Order = require("../order/models/OrderModel");
const OrderDetail = require("../order/models/OrderDetailModel");
const Payment = require("../checkout/models/paymentModel");
const OrderPayment = require("../checkout/models/OrderPaymentModel");
const Shipping = require("../shipping/models/ShippingModel");

const UserAddress = require("../user/models/UserAddressModel");
const Permission = require("../user/models/PermissionModel");
const RolePermission = require("../user/models/RolePermissionModel");

Product.belongsToMany(Category, {
  through: ProductCategory,
  foreignKey: "productId",
  otherKey: "categoryId",
});
Category.belongsToMany(Product, {
  through: ProductCategory,
  foreignKey: "categoryId",
  otherKey: "productId",
});

Category.hasMany(Category, {
  foreignKey: "parentId",
  as: "children",
});

Category.belongsTo(Category, {
  foreignKey: "parentId",
  as: "parent",
});
Category.hasMany(ImageCategory, { foreignKey: "categoryId" });
ImageCategory.belongsTo(Category, {
  foreignKey: "categoryId",
  as: "ImageCategories",
});

Role.belongsToMany(Permission, {
  through: RolePermission,
  foreignKey: "roleId",
  otherKey: "permissionId",
});
Permission.belongsToMany(Role, {
  through: RolePermission,
  foreignKey: "permissionId",
  otherKey: "roleId",
});

User.belongsToMany(Role, {
  through: UserRole,
  foreignKey: "userId",
  otherKey: "roleId",
});

Role.belongsToMany(User, {
  through: UserRole,
  foreignKey: "roleId",
  otherKey: "userId",
});

User.hasMany(UserAddress, { foreignKey: "userId" });
UserAddress.belongsTo(User, { foreignKey: "userId", as: "User" });

Shop.hasMany(ShopAddress, { foreignKey: "shopId" });
ShopAddress.belongsTo(Shop, { foreignKey: "shopId", as: "Shop" });

User.hasMany(Token, { foreignKey: "userId" });
Token.belongsTo(User, { foreignKey: "userId", as: "User" });
User.hasMany(BlacklistToken, { foreignKey: "userId" });
BlacklistToken.belongsTo(User, { foreignKey: "userId", as: "User" });

User.hasMany(Shop, { foreignKey: "userId" });
Shop.belongsTo(User, { foreignKey: "userId", as: "User" });

Shop.hasMany(Product, { foreignKey: "shopId" });
Product.belongsTo(Shop, { foreignKey: "shopId", as: "Shop" });

User.hasMany(ProductRating, { foreignKey: "userId" });
ProductRating.belongsTo(User, { foreignKey: "userId", as: "User" });

Product.hasMany(ProductRating, { foreignKey: "productId" });
ProductRating.belongsTo(Product, { foreignKey: "productId", as: "Product" });

Product.belongsToMany(Promotion, {
  through: ProductPromotion,
  foreignKey: "productId",
  otherKey: "promotionId",
});
Promotion.belongsToMany(Product, {
  through: ProductPromotion,
  foreignKey: "promotionId",
  otherKey: "productId",
});

ProductRating.hasMany(ProductRatingMedia, {
  foreignKey: "ratingId",
  as: "Media",
});
ProductRatingMedia.belongsTo(ProductRating, {
  foreignKey: "ratingId",
  as: "Rating",
});

User.hasOne(Cart, { foreignKey: "userId" });
Cart.belongsTo(User, { foreignKey: "userId", as: "User" });

Cart.hasMany(CartItem, { foreignKey: "cartId" });
CartItem.belongsTo(Cart, { foreignKey: "cartId", as: "Cart" });

Product.hasMany(CartItem, { foreignKey: "productId" });
CartItem.belongsTo(Product, { foreignKey: "productId", as: "Product" });

Product.hasOne(ProductPrice, { foreignKey: "productId", as: "ProductPrice" });
ProductPrice.belongsTo(Product, { foreignKey: "productId", as: "Product" });

Product.hasMany(Inventory, { foreignKey: "productId", as: "Inventory" });
Inventory.belongsTo(Product, { foreignKey: "productId", as: "Product" });

Product.hasMany(ProductMedia, { foreignKey: "productId" });
ProductMedia.belongsTo(Product, { foreignKey: "productId", as: "Product" });

Product.hasMany(ProductOption, { foreignKey: "productId" });
ProductOption.belongsTo(Product, { foreignKey: "productId", as: "Product" });

ProductOption.hasMany(ProductOptionValue, { foreignKey: "optionId" });
ProductOptionValue.belongsTo(ProductOption, {
  foreignKey: "optionId",
  as: "ProductOption",
});

Warehouse.hasMany(Inventory, { foreignKey: "warehouseId" });
Inventory.belongsTo(Warehouse, { foreignKey: "warehouseId", as: "Warehouse" });

Order.hasMany(OrderPayment, { foreignKey: "orderId" });
Payment.hasMany(OrderPayment, { foreignKey: "paymentId" });

Order.hasOne(Shipping, { foreignKey: "orderId" });
Shipping.belongsTo(Order, { foreignKey: "orderId" });

UserAddress.hasMany(Order, { foreignKey: "addressId" });
Order.belongsTo(UserAddress, { foreignKey: "addressId" });

User.hasMany(Order, { foreignKey: "userId" });
Order.belongsTo(User, { foreignKey: "userId" });

Shop.hasMany(Order, { foreignKey: "shopId" });
Order.belongsTo(Shop, { foreignKey: "shopId" });

Product.hasMany(OrderDetail, { foreignKey: "productId" });
OrderDetail.belongsTo(Product, { foreignKey: "productId" });

Order.hasMany(OrderDetail, { foreignKey: "orderId" });
OrderDetail.belongsTo(Order, { foreignKey: "orderId" });

User.hasMany(Payment, { foreignKey: "userId" });
Payment.belongsTo(User, { foreignKey: "userId" });

User.hasMany(Shipping, { foreignKey: "userId" });
Shipping.belongsTo(User, { foreignKey: "userId" });

const syncModels = async () => {
  const transaction = await sequelize.transaction();
  const syncForce = process.env.SYNC_FORCE === "true";
  try {
    await sequelize.sync({ force: syncForce });
    await createDefaultRoles({ transaction });
    await createDefaultPermission({ transaction });
    await createDefaultRolePermission({ transaction });
    await createAdminIfNotExists({ transaction });
    await transaction.commit();
    console.log("All tables synced successfully");
  } catch (error) {
    await transaction.rollback();
    console.error("Error syncing tables:", error);
  }
};

module.exports = {
  syncModels,
};
