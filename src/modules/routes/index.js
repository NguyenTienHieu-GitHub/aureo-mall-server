const authRoutes = require("../auth/routes/authRouter");
const userRoutes = require("../user/routes/userRouter");
const addressRoutes = require("../user/routes/addressRouter");
const roleRoutes = require("../user/routes/roleRouter");
const permissionRoutes = require("../user/routes/permissionRouter");
const productRoutes = require("../product/routes/productRouter");
const shopRoutes = require("../product/routes/shopRouter");
const categoryRoutes = require("../product/routes/categoryRouter");

function routes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/role", roleRoutes);
  app.use("/api/permission", permissionRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/shop", shopRoutes);
  app.use("/api/category", categoryRoutes);
}

module.exports = routes;
