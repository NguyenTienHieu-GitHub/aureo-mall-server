const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const route = require("./routes");

dotenv.config();
const app = express();
const port = 3080;

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// Router init
route(app);

app.listen(port, () => {
  console.log(`App listening on port http://localhost:${port}`);
});
