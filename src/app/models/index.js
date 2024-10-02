const sequelize = require("../../config/db/index");
const User = require("../models/UserModel");
const Address = require("../models/AddressModel");
const Role = require("../models/RoleModel");
const Permission = require("../models/PermissionModel");
const RolePermission = require("../models/RolePermissionModel");
const UserRole = require("../models/UserRoleModel");
const Token = require("../models/TokenModel");
const Product = require("../models/ProductModel");
const Category = require("../models/CategoryModel");
const ProductCategory = require("../models/ProductCategoryModel");

const createDefaultRoles = require("../utils/role");
const createDefaultPermission = require("../utils/permission");
const createDefaultRolePermission = require("../utils/rolePermission");
const createAdminIfNotExists = require("../utils/createAdmin");

// Thiết lập mối quan hệ nhiều - nhiều
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

// Thiết lập mối quan hệ một chiều
User.hasMany(Token, {
  foreignKey: "userId",
});
Token.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

User.hasMany(Address, {
  foreignKey: "userId",
});
Address.belongsTo(User, {
  foreignKey: "userId",
  as: "User",
});

const syncModels = async () => {
  try {
    await sequelize.sync({ force: false });
    await createDefaultRoles();
    await createDefaultPermission();
    await createDefaultRolePermission();
    await createAdminIfNotExists();
    console.log("All tables synced successfully");
  } catch (error) {
    console.error("Error syncing tables:", error);
  }
};

module.exports = {
  User,
  Address,
  Role,
  UserRole,
  Permission,
  RolePermission,
  Token,
  Product,
  Category,
  ProductCategory,
  syncModels,
};
