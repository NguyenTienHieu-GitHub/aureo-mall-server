const cloudinary = require("../../config/cloudinary/cloudinary");
const fs = require("fs");
const path = require("path");

const getResourceType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) return "image";
  if ([".mp4", ".mov", ".avi"].includes(ext)) return "video";
  throw new Error(`Unsupported file type for file: ${filePath}`);
};

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at specified path");
    }
    const resourceType = getResourceType(filePath);
    if (resourceType !== "image") {
      throw new Error("Only images are allowed for this upload");
    }
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "avatars",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
const uploadFilesToCloudinary = async (filePaths) => {
  try {
    if (!Array.isArray(filePaths)) {
      throw new Error("filePaths should be an array");
    }
    const imageUrls = [];
    for (const filePath of filePaths) {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
      }
      const resourceType = getResourceType(filePath);
      const result = await cloudinary.uploader.upload(filePath, {
        folder: "categories",
        resource_type: resourceType,
      });

      imageUrls.push(result.secure_url);
    }
    return imageUrls;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
module.exports = { uploadImageToCloudinary, uploadFilesToCloudinary };
