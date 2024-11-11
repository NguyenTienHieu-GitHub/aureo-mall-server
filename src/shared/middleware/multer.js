const multer = require("multer");
const path = require("path");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder = "src/modules/uploads/";

    if (file.fieldname === "avatar") {
      folder += "avatars";
    } else if (file.fieldname === "product") {
      folder += "products";
    } else if (file.fieldname === "imageUrls") {
      folder += "categories";
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
const uploadProduct = multer({ storage: storage }).single("product");
const uploadCategory = multer({ storage: storage }).array("imageUrls", 5);
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
};
