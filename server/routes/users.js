const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const sanitized = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, `resume-${Date.now()}-${sanitized}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/pdf|doc|docx|txt/.test(file.originalname.toLowerCase()) || /pdf|msword|officedocument|text/.test(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF, DOC, DOCX, or TXT resume files are allowed.'));
    }
  }
});

router.get('/me', protect, controller.me);
router.put('/profile', protect, controller.updateProfile);
router.put('/me', protect, controller.updateProfile);
router.post('/resume', protect, upload.single('resume'), controller.uploadResume);
router.delete('/resume', protect, controller.deleteResume);
router.get('/:username', controller.profile);

module.exports = router;
