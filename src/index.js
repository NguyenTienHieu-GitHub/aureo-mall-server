const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const route = require("./router");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./src/aureomall-swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

dotenv.config();
const app = express();
const port = 3080;
const host = "127.0.0.1";

app.use(cors());

// Cấu hình tùy chỉnh
const corsOptions = {
  origin: "http://example.com", // Cho phép yêu cầu từ nguồn gốc này
  methods: "GET,POST,PUT,DELETE", // Các phương thức HTTP được phép
  allowedHeaders: "Content-Type,Authorization", // Các tiêu đề HTTP được phép
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Router init
route(app);

app.listen(port, host, () => {
  console.log(`Server đang chạy tại http://${host}:${port}`);
});
