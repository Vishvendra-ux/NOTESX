const router = require('express').Router();
const controller = require('../controllers/hierarchyController');

// Course Categories
router.get('/course-categories', controller.getCourseCategories);

// Courses (Degrees: B.Tech, B.E., BCA, B.Com, etc.)
router.get('/courses', controller.getCourses);
router.get('/courses/:id', controller.getCourseByIdOrSlug);

// Branches (CSE, AIML, Mechanical, etc.)
router.get('/branches', controller.getBranches);
router.get('/branches/:id', controller.getBranchByIdOrSlug);

// Dynamic Years & Semesters
router.get('/years', controller.getYears);
router.get('/semesters', controller.getSemesters);

// Subjects
router.get('/subjects', controller.getSubjects);
router.get('/subjects/:id', controller.getSubjectByIdOrSlug);

module.exports = router;
