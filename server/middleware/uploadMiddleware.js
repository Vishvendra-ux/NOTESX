const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Attempt to load Cloudinary
let cloudinary;
let CloudinaryStorage;
const cloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);
try {
  cloudinary = require('cloudinary').v2;
  const storageCloudinary = require('multer-storage-cloudinary');
  CloudinaryStorage = storageCloudinary.CloudinaryStorage;
  
  if (cloudinaryConfigured) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });
  }
} catch (err) {
  // Cloudinary not installed or failed to load
}

// Local disk is suitable for development only: ephemeral production disks can
// discard student notes and profile files during a deploy or container restart.
const uploadsDir = path.join(__dirname, '..', 'uploads');

const getStorage = (folderName) => {
  if (cloudinary && CloudinaryStorage && cloudinaryConfigured) {
    return new CloudinaryStorage({
      cloudinary: cloudinary,
      params: {
        folder: `NOTESX/${folderName}`,
        resource_type: 'auto',
      },
    });
  }

  if (process.env.NODE_ENV === 'production') {
    const unavailableStorage = {
      _handleFile(req, file, callback) {
        const error = new Error('Uploads are disabled until persistent Cloudinary storage is configured.');
        error.statusCode = 503;
        error.code = 'UPLOADS_DISABLED';
        callback(error);
      },
      _removeFile(req, file, callback) {
        callback(null);
      }
    };
    return unavailableStorage;
  }

  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  {
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
