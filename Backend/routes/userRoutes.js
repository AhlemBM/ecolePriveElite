const express = require('express');
const userController = require('../controllers/userCtr'); // Assurez-vous que ce chemin est correct
const multer = require('multer');
const storage = require('../config/multerConfig'); // Assurez-vous que ce chemin est correct

const router = express.Router();
const upload = multer({ storage });

// Routes pour l'inscription et la connexion des utilisateurs
router.post('/signup', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), userController.signup);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

// Routes pour la gestion des utilisateurs
router.get('/', userController.getAllUsers); // Récupérer tous les utilisateurs
router.get('/:id', userController.getUserById); // Récupérer un utilisateur par ID
router.put('/:id', upload.fields([{ name: 'img', maxCount: 1 }, { name: 'doc', maxCount: 1 }]), userController.updateUser); // Mettre à jour un utilisateur
router.delete('/:id', userController.deleteUser); // Supprimer un utilisateur

// Route pour ajouter un enfant à un parent
router.post('/:parentId/children', userController.addChildToParent); // Ajouter un enfant à un parent

module.exports = router;
