const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const route = require("./routes");
const swaggerUi = require("swagger-ui-express");
const fs = require("fs");
const YAML = require("yaml");
const file = fs.readFileSync("./src/aureomall-swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

dotenv.config();
const app = express();
const port = 3080;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Router init
route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
