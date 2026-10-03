const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Attempt to load Cloudinary
let cloudinary;
let CloudinaryStorage;
try {
  cloudinary = require('cloudinary').v2;
  const storageCloudinary = require('multer-storage-cloudinary');
  CloudinaryStorage = storageCloudinary.CloudinaryStorage;
  
  if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
} catch (err) {
  // Cloudinary not installed or failed to load
}

// Fallback to local storage if Cloudinary is not configured
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const getStorage = (folderName) => {
  if (cloudinary && process.env.CLOUDINARY_CLOUD_NAME) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `NOTESX/${folderName}`,
        resource_type: 'auto',
      },
    });
  } else {
    console.warn(`⚠️ Cloudinary is not configured. Saving ${folderName} locally. This WILL be deleted in cloud environments (Render, Heroku, Vercel).`);
    return multer.diskStorage({
      destination: (req, file, cb) => cb(null, uploadsDir),
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
        cb(null, `${folderName}-${Date.now()}-${base}${ext}`);
      }
    });
  }
};

module.exports = { getStorage };
