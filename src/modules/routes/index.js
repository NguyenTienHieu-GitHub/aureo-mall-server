const authRoutes = require("../auth/routes/authRouter");
const userRoutes = require("../user/routes/userRouter");
const addressRoutes = require("../user/routes/addressRouter");
const roleRoutes = require("../user/routes/roleRouter");
const permissionRoutes = require("../user/routes/permissionRouter");
const productRoutes = require("../product/routes/productRouter");
const shopRoutes = require("../shop/routes/shopRouter");
const categoryRoutes = require("../product/routes/categoryRouter");
const cartRoutes = require("../cart/routes/cartRouter");
const orderRoutes = require("../order/routes/orderRouter");
const checkoutRoutes = require("../checkout/routes/CheckoutRoute");
const shippingRoutes = require("../shipping/routes/shippingRouter");
const bannerRoutes = require("../banner/routes/bannerRouter");
function routes(app) {
  app.use("/api/auth", authRoutes);
  app.use("/api/users", userRoutes);
  app.use("/api/address", addressRoutes);
  app.use("/api/role", roleRoutes);
  app.use("/api/permission", permissionRoutes);
  app.use("/api/product", productRoutes);
  app.use("/api/shop", shopRoutes);
  app.use("/api/categories", categoryRoutes);
  app.use("/api/cart", cartRoutes);
  app.use("/api/order", orderRoutes);
  app.use("/api/checkout", checkoutRoutes);
  app.use("/api/shipping", shippingRoutes);
  app.use("/api/banners", bannerRoutes);
}

module.exports = routes;
