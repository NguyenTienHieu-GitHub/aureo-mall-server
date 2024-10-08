const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const route = require("./router");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./config/swagger/swagger");
const { syncModels } = require("./app/models/index");
const responsesFormatter = require("./app/middleware/responseFormatter");

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
  res.json({ message: "CORS is working!" });
});

syncModels();
// Router init
route(app);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
  console.log(`Swagger đang chạy tại http://localhost:${port}/api-docs`);
});
