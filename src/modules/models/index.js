const sequelize = require("../../config/db/index");
const createDefaultRoles = require("../../shared/utils/role");
const createDefaultPermission = require("../../shared//utils/permission");
const createDefaultRolePermission = require("../../shared//utils/rolePermission");
const createAdminIfNotExists = require("../../shared//utils/createAdmin");

const User = require("../auth/models/UserModel");
const Role = require("../auth/models/RoleModel");
const UserRole = require("../auth/models/UserRoleModel");
const Token = require("../auth/models/TokenModel");

const Product = require("../product/models/ProductModel");
const Category = require("../product/models/CategoryModel");
const ProductCategory = require("../product/models/ProductCategoryModel");
const ProductPrice = require("../product/models/ProductPriceModel");
const Shop = require("../product/models/ShopModel");
const Inventory = require("../product/models/InventoryModel");
const Warehouse = require("../product/models/WarehouseModel");
const ProductMedia = require("../product/models/ProductMediaModel");
const ProductOption = require("../product/models/ProductOptionModel");

const Address = require("../user/models/AddressModel");
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

User.hasMany(Address, {
  foreignKey: "userId",
});
Address.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Token, {
  foreignKey: "userId",
});
Token.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Shop, {
  foreignKey: "userId",
});
Shop.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

Shop.hasMany(Product, {
  foreignKey: "shopId",
});
Product.belongsTo(Shop, {
  foreignKey: "shopId",
  as: "Shop",
});

Product.hasMany(ProductPrice, {
  foreignKey: "productId",
});
ProductPrice.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

Product.hasMany(Inventory, {
  foreignKey: "productId",
});
Inventory.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

Product.hasMany(ProductMedia, {
  foreignKey: "productId",
});
ProductMedia.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

Product.hasMany(ProductOption, {
  foreignKey: "productId",
});
ProductOption.belongsTo(Product, {
  foreignKey: "productId",
  as: "Product",
});

Warehouse.hasMany(Inventory, {
  foreignKey: "warehouseId",
});
Inventory.belongsTo(Warehouse, {
  foreignKey: "warehouseId",
  as: "Warehouse",
});

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
  User,
  Role,
  UserRole,
  Token,
  Product,
  Category,
  ProductCategory,
  ProductPrice,
  Shop,
  Inventory,
  Warehouse,
  ProductMedia,
  ProductOption,
  Address,
  Permission,
  RolePermission,
  syncModels,
};
