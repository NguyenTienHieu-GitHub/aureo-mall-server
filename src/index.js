const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const routes = require("./modules/routes/index");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger/swagger");
const { syncModels } = require("./modules/models/index");
const responsesFormatter = require("./shared/middleware/responseFormatter");
const { startNgrok } = require("./config/ngrok/ngrokConfig");
const path = require("path");

const app = express();
const corsOptions = {
  origin: [
    "http://localhost:4200",
    "http://localhost:3080",
    "http://127.0.0.1:3080",
  ],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};
if (process.env.NODE_ENV === "development") {
  const swaggerOptions = {
    swaggerDefinition: swaggerDocument,
    apis: ["./routes/*.js", "./swagger/*.js"],
  };
  const swaggerSpec = swaggerJsdoc(swaggerOptions);
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(responsesFormatter);
app.get("/api/data", (req, res) => {
  res.locals.message = "CORS is working!";
  res.json();
});
app.use(
  "/avatar",
  express.static(path.join(__dirname, "../src/modules/uploads/avatars"))
);
syncModels();
routes(app);

app.use((req, res, next) => {
  res.status(404).json({ message: "Không tìm thấy trang" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});
app.listen(process.env.SERVER_PORT, async () => {
  console.log(
    `Server đang chạy tại http://localhost:${process.env.SERVER_PORT}`
  );
  if (process.env.NODE_ENV !== "production") {
    console.log(
      `Swagger đang chạy tại http://localhost:${process.env.SERVER_PORT}/api-docs`
    );
  }
  const ngrokUrl = await startNgrok();
  console.log(`Public URL: ${ngrokUrl}`);
});
