const express = require('express');
const userController = require('../controllers/userCtr'); // Assurez-vous que ce chemin est correct
const multer = require('multer');
const storage = require('../config/multerConfig'); // Assurez-vous que ce chemin est correct
const authAdmin = require("../middleware/auth"); // Authentification admin
const auth = require("../middleware/auth"); // Authentification utilisateur pour certaines routes
const router = express.Router();
const upload = multer({ storage });

// Routes pour l'inscription et la connexion des utilisateurs
router.post('/signup', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), userController.signup); // Inscription
router.post('/login', userController.login); // Connexion
router.post('/logout', userController.logout); // Déconnexion avec auth middleware (authentifie l'utilisateur)

// Routes pour la gestion des utilisateurs
router.get('/',  userController.getAllUsers); // Récupérer tous les utilisateurs (admin uniquement)
router.get('/:id', userController.getUserById); // Récupérer un utilisateur par ID (authentifie l'utilisateur)
router.put('/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), userController.updateUser); // Mettre à jour un utilisateur (authentifie l'utilisateur)
router.delete('/:id',  userController.deleteUser); // Supprimer un utilisateur (admin uniquement)

// Routes pour gérer les enfants d'un parent
router.post('/:parentId/children', userController.addChildToParent); // Ajouter un enfant à un parent (authentifie l'utilisateur)

// Routes pour la validation des utilisateurs (admin uniquement)
router.put("/validate/:userId",  userController.validateUser); // Valider un utilisateur par l'admin

// Routes pour gérer les utilisateurs en attente de validation
router.get('/pending/getAll',  userController.getPendingUsers); // Récupérer les utilisateurs en attente de validation (admin uniquement)
// Route pour la connexion de l'admin
router.post('/admin-login', userController.loginAdmin); // Connexion de l'admin (authentifie l'admin)

module.exports = router;
