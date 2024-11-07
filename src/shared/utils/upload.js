const cloudinary = require("../../config/cloudinary/cloudinary");
const fs = require("fs");

const uploadImageToCloudinary = async (filePath) => {
  try {
    if (!fs.existsSync(filePath)) {
      throw new Error("File not found at specified path");
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
const uploadImagesToCloudinary = async (filePaths) => {
  try {
    if (!Array.isArray(filePaths)) {
      throw new Error("filePaths should be an array");
    }
    const imageUrls = [];
    for (const image of filePaths) {
      if (!fs.existsSync(image)) {
        throw new Error(`File not found at path: ${image}`);
      }
      const result = await cloudinary.uploader.upload(image, {
        folder: "categories",
      });

      imageUrls.push(result.secure_url);
    }
    return imageUrls;
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw new Error("Failed to upload image to Cloudinary");
  }
};
module.exports = { uploadImageToCloudinary, uploadImagesToCloudinary };
