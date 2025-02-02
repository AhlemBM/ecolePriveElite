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
        // Extract the token from the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Authentication required' });
        }

        const token = authHeader.split(' ')[1]; // Extract the token part

        // Verify the token using the same secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        const teacherId = decodedToken.id; // 🔥 Correction ici (avant c'était userId)

        // Vérifier si l'utilisateur est bien un enseignant
        const teacher = await User.findById(teacherId);
        if (!teacher || teacher.role !== "teacher") {
            return res.status(403).json({ message: "Access denied. Only teachers can add courses." });
        }

        // Créer un nouveau cours
        const course = new Course({
            ...req.body,
            teacherId: teacherId // Assurez-vous de lier l'ID de l'enseignant
        });
        await course.save();

        // Ajouter le cours à la liste des cours du professeur
        teacher.courses.push(course._id);
        await teacher.save();

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
    const { id } = req.params;
    try {
        const course = await Course.findById(id).populate("teacherId", "firstName lastName"); // Récupère le cours avec les infos du professeur
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.json(course);
    } catch (error) {
        res.status(500).json({ message: "Error fetching course", error: error.message });
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
    const { teacherId } = req.params.id;  // Récupérer l'ID de l'enseignant depuis les paramètres de la requête
    try {
        // Trouver tous les cours associés à cet enseignant
        const courses = await Course.find({ teacherId: teacherId }).populate("teacherId", "firstName lastName");

        // Si aucun cours n'est trouvé pour cet enseignant
        if (!courses || courses.length === 0) {
            return res.status(404).json({ message: "No courses found for this teacher" });
        }

        // Retourner la liste des cours trouvés
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: "Error fetching courses by teacher", error: error.message });
    }
};


module.exports = { addCourse, getAllCourses, getCourseById, deleteCourse, editCourse ,getCoursesByTeacherId};
