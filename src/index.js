const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const routes = require("./modules/routes/index");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger/swagger");
const { syncModels, rolesWithPermissions } = require("./modules/models/index");
const responsesFormatter = require("./shared/middleware/responseFormatter");

dotenv.config();
const app = express();
const port = 3080;

const corsOptions = {
  origin: ["http://localhost:4200", "http://localhost:3080"],
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: ["Authorization", "Content-Type"],
  credentials: true,
};

const swaggerOptions = {
  swaggerDefinition: swaggerDocument,
  apis: ["./routes/*.js", "./swagger/*.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(responsesFormatter);

app.get("/api/data", (req, res) => {
  res.locals.message = "CORS is working!";
  res.json();
});
syncModels();

routes(app);

app.use((req, res, next) => {
  res.status(404).json({ message: "Không tìm thấy trang" });
});
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`Swagger đang chạy tại http://localhost:${port}/api-docs`);
});
