const express = require("express");
const router = express.Router();
const {
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/bannerController");
const {
  uploadBanner,
  fixFilePath,
} = require("../../../shared/middleware/multer");

router.put("/:id", uploadBanner, fixFilePath, updateBanner);
router.delete("/:id", deleteBanner);
router.post("/", uploadBanner, fixFilePath, createBanner);
router.get("/", getBanners);

module.exports = router;
