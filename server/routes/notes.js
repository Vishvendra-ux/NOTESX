const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const controller = require('../controllers/noteController');
const { protect } = require('../middleware/authMiddleware');
const { uploadLimiter } = require('../middleware/rateLimiter');

const { getStorage } = require('../middleware/uploadMiddleware');

// Multer Storage Configuration
const storage = getStorage('notes');

// Strict File Security Filter (Reject executables, accept only safe educational formats)
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.jpg', '.jpeg', '.png'];
  const ext = path.extname(file.originalname).toLowerCase();

  // Explicit blacklist rejection
  const blacklisted = ['.exe', '.bat', '.sh', '.js', '.cmd', '.vbs', '.msi', '.com', '.php'];
  if (blacklisted.includes(ext)) {
    return cb(new Error('Executable or script files are strictly prohibited.'), false);
  }

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), and images are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15 MB limit
  fileFilter
});

// ── Specific sub-routes first to avoid :id collisions ──
router.get('/user/bookmarks', protect, controller.getUserBookmarks);
router.get('/contributors/:id', controller.getContributorProfile);

// ── Notes List & Single Note ──
router.get('/', controller.list);
router.get('/:id', controller.get);

// ── Upload Note ──
router.post('/', protect, uploadLimiter, upload.single('file'), controller.create);

// ── Interactions: Download, Bookmark, Report, Reviews ──
router.post('/:id/download', controller.download);
router.post('/:id/bookmark', protect, controller.toggleBookmark);
router.post('/:id/report', protect, controller.report);

router.get('/:id/reviews', controller.getReviews);
router.post('/:id/reviews', protect, controller.addOrUpdateReview);
router.post('/:id/reviews/:reviewId/helpful', protect, controller.toggleHelpfulReview);

module.exports = router;
