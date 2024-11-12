const cloudinary = require("../../config/cloudinary/cloudinary");
const fs = require("fs");
const path = require("path");

const getResourceType = (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  if ([".jpg", ".jpeg", ".png", ".gif"].includes(ext)) return "image";
  if ([".mp4", ".mov", ".avi"].includes(ext)) return "video";
  throw new Error(`Unsupported file type for file: ${filePath}`);
};

const uploadImageToCloudinary = async (filePath, folder) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at specified path");
    }
    const resourceType = getResourceType(filePath);
    const result = await cloudinary.uploader.upload(filePath, {
      folder,
      resource_type: resourceType,
    });
    fs.unlinkSync(filePath);
    return result.secure_url;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error.message);
    throw new Error("Failed to upload image to Cloudinary");
  }
};

const uploadFilesToCloudinary = async (filePaths, folder) => {
  try {
    if (!Array.isArray(filePaths)) {
      throw new Error("filePaths should be an array");
    }

    const uploadPromises = filePaths.map(async (filePath) => {
      if (!fs.existsSync(filePath)) {
        throw new Error(`File not found at path: ${filePath}`);
      }
      const resourceType = getResourceType(filePath);
      const result = await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: resourceType,
      });
      fs.unlinkSync(filePath);
      return result.secure_url;
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Error uploading files to Cloudinary:", error.message);
    throw new Error("Failed to upload files to Cloudinary");
  }
};

module.exports = { uploadImageToCloudinary, uploadFilesToCloudinary };
