const authRoutes = require("../auth/routes/auth");
const userRoutes = require("../user/routes/user");
const addressRoutes = require("../user/routes/address");
const roleRoutes = require("../user/routes/role");
const permissionRoutes = require("../user/routes/permission");
const productRoutes = require("../product/routes/product");
const shopRoutes = require("../product/routes/shop");

function routes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/role", roleRoutes);
  app.use("/api/permission", permissionRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/shop", shopRoutes);
}

module.exports = routes;
