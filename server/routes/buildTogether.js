const router = require('express').Router();
const controller = require('../controllers/buildTogetherController');
const { protect, optionalProtect } = require('../middleware/authMiddleware');
const ProjectCollab = require('../models/ProjectCollab');

const illustrativeTitles = new Set([
  'DevSync: Realtime Collaborative Code & Whiteboard IDE',
  'MedScan AI: On-Device Chest X-Ray Triage App',
  'UniSwap: Zero-Commission Campus Marketplace & Textbook Rental'
]);

async function blockIllustrativeProjectActions(req, res, next) {
  try {
    if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) return next();
    const project = await ProjectCollab.findById(req.params.id).select('isDemo title').lean();
    if (project && (project.isDemo || illustrativeTitles.has(project.title))) {
      return res.status(409).json({ message: 'This is an illustrative preview, not an active student project.' });
    }
    return next();
  } catch (error) {
    return next(error);
  }
}

router.get('/', optionalProtect, controller.list);
router.get('/:id', optionalProtect, controller.get);

router.post('/', protect, controller.create);
router.post('/:id/apply', protect, blockIllustrativeProjectActions, controller.apply);
router.post('/:id/upvote', protect, blockIllustrativeProjectActions, controller.toggleUpvote);
router.patch('/:id/demo', protect, blockIllustrativeProjectActions, controller.publishDemo);
router.patch('/:id/applications/:appId', protect, blockIllustrativeProjectActions, controller.manageApplication);
router.delete('/:id', protect, blockIllustrativeProjectActions, controller.delete);

router.get('/:id/messages', protect, blockIllustrativeProjectActions, controller.getMessages);

module.exports = router;
