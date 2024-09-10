const userRouter = require("../router/user");
const authRouter = require("../router/auth");

function route(app) {
  app.use("/api/users", userRouter);
  app.use("/api/auth", authRouter);

  // Middleware xử lý lỗi 404 (nên đặt sau tất cả các route)
  app.use((req, res, next) => {
    res.status(404).json({ message: "Không tìm thấy trang" });
  });
}

module.exports = route;
