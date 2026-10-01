const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const controller = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const ALLOWED_RESUME_EXTS = ['.pdf', '.doc', '.docx'];
const ALLOWED_RESUME_MIMES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `resume-${Date.now()}-${base}${ext}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB limit
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_RESUME_EXTS.includes(ext) && ALLOWED_RESUME_MIMES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only valid PDF, DOC, or DOCX documents are allowed as resumes.'), false);
    }
  }
});

router.get('/me', protect, controller.me);
router.put('/profile', protect, controller.updateProfile);
router.put('/me', protect, controller.updateProfile);
router.post('/resume', protect, uploadLimiter, upload.single('resume'), controller.uploadResume);
router.delete('/resume', protect, controller.deleteResume);
router.get('/:username', controller.profile);

module.exports = router;
