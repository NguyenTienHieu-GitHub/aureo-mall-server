const userRouter = require("../routes/user");
const authRouter = require("../routes/auth");

function route(app) {

  app.use("/users", userRouter);
  app.use("/auth", authRouter);

  // Middleware xử lý lỗi 404 (nên đặt sau tất cả các route)
  app.use((req, res, next) => {
    res.status(404).json({ message: "Không tìm thấy trang" });
  });
}

module.exports = route;
