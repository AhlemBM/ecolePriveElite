const Course = require("../models/course");
const jwt = require('jsonwebtoken'); // Assurez-vous d'avoir installé jsonwebtoken

const User = require('../models/user');

const multer = require("multer"); // Pour gérer l'upload de fichiers

// Configuration de l'upload de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Le dossier où les fichiers seront stockés
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Génère un nom unique pour chaque fichier
    }
});

const upload = multer({ storage: storage });

// Ajouter un cours
const addCourse = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1];
        const teacherId = '679e502702330be9a805a07b'; // ID de l'enseignant, tu peux le décoder depuis le token JWT

        // Vérifier si l'utilisateur est bien un enseignant
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can add courses." });
        }

        // Créer un nouveau cours
        const course = new Course({
            ...req.body,
            teacherId: teacherId
        });
        await course.save();

        // Ajouter le cours à la liste des cours du professeur
        teacher.courses.push(course._id);
        await teacher.save();

        // Ajouter le cours aux étudiants
        if (req.body.students && req.body.students.length > 0) {
            const studentUpdates = req.body.students.map(student => ({
                updateOne: {
                    filter: { _id: student.studentId }, // Sélectionne l'étudiant par son ID
                    update: {
                        $push: {
                            studentCourses: {
                                courseId: course._id,
                                note: student.note || null,
                                evaluation: student.evaluation || ''
                            }
                        }
                    }
                }
            }));

            // Mettre à jour tous les étudiants
            await User.bulkWrite(studentUpdates);
        }

        res.json({ message: "Course added successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error adding course", error: error.message });
    }
};



// Récupérer tous les cours
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate("teacherId", "firstName lastName"); // Récupère tous les cours et inclut les infos du professeur
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses", error: error.message });
    }
};

// Récupérer un cours par son ID
const getCourseById = async (req, res) => {

        const courseId = req.params.id;  // Récupérer l'ID du cours depuis les paramètres de la requête
        try {
            // Trouver un cours par son ID et peupler les étudiants
            const course = await Course.findById(courseId)
                .populate({
                    path: 'students.studentId', // Peupler les données des étudiants à partir du champ `studentId`
                    select: 'firstName lastName email' // Sélectionner les champs que tu veux (prénom, nom, email)
                })
                .populate('teacherId', 'firstName lastName'); // Peupler les données du professeur

            if (!course) {
                return res.status(404).json({ message: 'Course not found' });
            }

            res.json(course);  // Retourner le cours avec les étudiants peuplés
        } catch (error) {
            res.status(500).json({ message: 'Error fetching course details', error: error.message });
        }
    };

// Supprimer un cours
const deleteCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findByIdAndDelete(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Supprimer le cours de la liste des cours du professeur
        const teacher = await User.findById(course.teacherId);
        if (teacher) {
            teacher.courses = teacher.courses.filter(courseId => courseId.toString() !== id);
            await teacher.save();
        }

        res.json({ message: "Course deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting course", error: error.message });
    }
};

// Modifier un cours
const editCourse = async (req, res) => {
    const { id } = req.params;
    try {
        const course = await Course.findById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Mise à jour des informations du cours
        const updatedCourseData = req.body;

        // Si une image est téléchargée, on met à jour le champ "img"
        if (req.file) {
            updatedCourseData.img = req.file.path; // L'URL du fichier image
        }

        Object.assign(course, updatedCourseData);
        await course.save();

        res.json({ message: "Course updated successfully", course });
    } catch (error) {
        res.status(500).json({ message: "Error updating course", error: error.message });
    }
};
// Récupérer les cours d'un enseignant par son ID
const getCoursesByTeacherId = async (req, res) => {
    try {
        const teacherId = req.params.id;

        // Trouver l'étudiant avec ses cours en utilisant populate
        const teacher = await User.findById(teacherId).populate({
            path: 'courses', // Le champ qui contient les IDs des cours
            populate: {
                path: 'teacherId', // Charger les informations du professeur (ex : firstName, lastName)
                select: 'firstName lastName' // Sélectionner seulement les champs nécessaires du professeur
            }
        });

        if (!teacher) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Retourner les détails des cours de l'étudiant
        res.json(teacher.courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Récupérer les cours d'un étudiant par son ID

const getCoursesByStudentId = async (req, res) => {
    try {
        const studentId = req.params.id;

        // Trouver l'étudiant avec ses cours en utilisant populate
        const student = await User.findById(studentId).populate({
            path: 'studentCourses.courseId', // Peupler l'ID du cours dans le tableau studentCourses
            populate: {
                path: 'teacherId', // Peupler les informations du professeur (ex : firstName, lastName)
                select: 'firstName lastName' // Sélectionner seulement les champs nécessaires du professeur
            }
        });

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Retourner les détails des cours de l'étudiant
        const courses = student.studentCourses.map(studentCourse => ({
            courseName: studentCourse.courseId.courseName,
            duration: studentCourse.courseId.duration,
            teacher: `${studentCourse.courseId.teacherId.firstName} ${studentCourse.courseId.teacherId.lastName}`,
            note: studentCourse.note,
            evaluation: studentCourse.evaluation
        }));

        res.json(courses);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// Donner une note et une évaluation à un étudiant dans un cours
const giveGradeAndEvaluation = async (req, res) => {
    const { courseId, studentId } = req.params;  // Récupérer l'ID du cours et de l'étudiant depuis les paramètres
    const { grade, evaluation } = req.body;  // Récupérer la note et l'évaluation depuis le corps de la requête

    try {
        // Trouver le cours par son ID
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Trouver l'étudiant dans le tableau des étudiants du cours
        const student = course.students.find(student => student.studentId.toString() === studentId);
        if (!student) {
            return res.status(404).json({ message: "Student not enrolled in this course" });
        }

        // Mettre à jour la note et l'évaluation de l'étudiant
        student.note = grade;
        student.evaluation = evaluation;

        // Sauvegarder le cours avec les nouvelles données
        await course.save();

        res.json({ message: "Grade and evaluation updated successfully", course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating grade and evaluation", error: error.message });
    }
};

module.exports = { addCourse, getAllCourses, getCourseById, deleteCourse, editCourse,
        getCoursesByTeacherId, getCoursesByStudentId, giveGradeAndEvaluation };

