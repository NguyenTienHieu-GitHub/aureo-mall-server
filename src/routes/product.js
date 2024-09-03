const express = require("express");
const router = express.Router();
const productsController = require("../app/controller/ProductController");

router.get("/fetch-data", productsController.fetchAndInsertData);

module.exports = router;
