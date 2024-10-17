const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/modules/uploads/avatars");
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

const fixFilePath = (req, res, next) => {
  if (req.file) {
    req.file.path = req.file.path.replace(/\\/g, "/");
  }
  next();
};

module.exports = {
  uploadAvatar,
  fixFilePath,
};
