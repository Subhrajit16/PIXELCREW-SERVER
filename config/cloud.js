const cloudinary = require('cloudinary').v2;
const fs = require('fs');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (localFilePath) => {
    if (!localFilePath) return null;
  try {
    const response = await cloudinary.uploader.upload(localFilePath,{
        resource_type: "auto",
    });
    // console.log(response);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath)
    console.log(error);
    return null;
  }
};

module.exports = uploadOnCloudinary;