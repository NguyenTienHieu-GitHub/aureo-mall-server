const authRoutes = require("../auth/routes/auth");
const userRoutes = require("../user/routes/user");
const addressRoutes = require("../user/routes/address");
const roleRoutes = require("../user/routes/role");
const permissionRoutes = require("../user/routes/permission");

function routes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/role", roleRoutes);
  app.use("/api/permission", permissionRoutes);
}

module.exports = routes;
