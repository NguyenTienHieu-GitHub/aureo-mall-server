const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "src/modules/uploads/";

    if (file.fieldname === "avatar") {
      folder += "avatars";
    } else if (file.fieldname === "mediaList") {
      folder += "products";
    } else if (file.fieldname === "imageUrls") {
      folder += "categories";
    } else if (file.fieldname === "mediaUrl") {
      folder += "ratings";
    } else if (file.fieldname === "imageUrl") {
      folder += "banners";
    }
    cb(null, folder);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadAvatar = multer({ storage: storage }).single("avatar");
const uploadProduct = multer({ storage: storage }).array("mediaList", 5);
const uploadCategory = multer({ storage: storage }).array("imageUrls", 5);
const uploadRating = multer({ storage: storage }).array("mediaUrl", 5);
const uploadBanner = multer({ storage: storage }).single("imageUrl");
const uploadNone = multer({ storage: storage }).none();
const fixFilePath = (req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  next();
};

module.exports = {
  uploadAvatar,
  fixFilePath,
  uploadProduct,
  uploadCategory,
  uploadNone,
  uploadRating,
  uploadBanner,
};
