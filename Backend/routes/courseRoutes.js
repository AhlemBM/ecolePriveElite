const express = require('express');
const courseController = require('../controllers/courseCtr');
const multer = require('multer');
const storage = require('../config/multerConfig');

const router = express.Router();
const upload = multer({ storage });

// Routes pour les cours
router.post('/add', courseController.addCourse); // Ajouter un cours
router.get('/', courseController.getAllCourses); // Obtenir tous les cours
router.get('/:id', courseController.getCourseById); // Obtenir un cours par son ID
router.delete('/:id', courseController.deleteCourse); // Supprimer un cours
router.put('/:id', upload.single('img'), courseController.editCourse); // Modifier un cours
router.get('/teacher/:id', courseController.getCoursesByTeacherId);
router.get('/student/:id', courseController.getCoursesByStudentId)
// Ajouter une route pour donner une note et une évaluation
router.put('/grade/:courseId/:studentId', courseController.giveGradeAndEvaluation);
module.exports = router;
