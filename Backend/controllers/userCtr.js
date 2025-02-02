const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Assurez-vous d'avoir bien défini ce modèle
const Course = require('../models/course'); // Si nécessaire
require('dotenv').config();
// Inscription d'un nouvel utilisateur
const signup = async (req, res) => {
    const { firstName, lastName, email, password, role, gender, address, tel } = req.body;

    try {
        // Vérifier si l'utilisateur existe déjà
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }



        // Créer un nouvel utilisateur
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role,
            gender,
            address,
            tel,
            avatar: req.files?.img ? `http://localhost:3000/images/${req.files.img[0].filename}` : undefined,
            cv: req.files?.doc ? `http://localhost:3000/docs/${req.files.doc[0].filename}` : undefined,
        });

        // Sauvegarder l'utilisateur dans la base de données
        await newUser.save();
        res.json({ msg: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Fonction de login
const login = async (req, res) => {
    try {
        const { email, mdp, role } = req.body;

        if (!email || !mdp || !role) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const validRoles = ["student", "teacher", "parent", "admin" ];
        if (!validRoles.includes(role)) {
            return res.status(400).json({ message: "Invalid role selected" });
        }

        // Vérifier si l'utilisateur existe avec ce rôle
        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: "User not found or role mismatch" });
        }

        // Vérification du mot de passe (supposons bcrypt)
        const isMatch = await bcrypt.compare(mdp, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        // Générer un token JWT (optionnel)
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET, // 🔥 Utilise la même clé que dans jwt.verify()
            { expiresIn: "1h" }
        );


        res.json({ message: "Login successful", token, user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};
const logout = (req, res) => {
    try {

        res.json({ message: "Logout successful" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};


// Récupérer tous les utilisateurs
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find()
            .populate('courses')
            .populate('studentCourses.courseId')
            .populate('children');

        res.json({ users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Récupérer un utilisateur par ID
const mongoose = require('mongoose');
const getUserById = async (req, res) => {
    const userId = req.params.id;
    // Vérification si l'ID est valide avant de tenter la recherche
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
        const user = await User.findById(new mongoose.Types.ObjectId(userId));


        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Mettre à jour un utilisateur
const updateUser = async (req, res) => {
    const userId = req.params.id;
    const { firstName, lastName, email, address, tel, avatar } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Mettre à jour les informations de l'utilisateur
        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.email = email || user.email;
        user.address = address || user.address;
        user.tel = tel || user.tel;
        user.avatar = avatar || user.avatar;

        await user.save();

        res.json({ msg: "User updated successfully", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Supprimer un utilisateur
const deleteUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        // Supprimer l'utilisateur
        await User.deleteOne({ _id: userId });
        res.json({ msg: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Ajouter un enfant à un parent
const addChildToParent = async (req, res) => {
    const { parentId } = req.params;
    const { tel: childTel } = req.body;

    try {
        const parent = await User.findById(parentId);
        if (!parent || parent.role !== "parent") {
            return res.status(404).json({ msg: "Parent not found" });
        }

        const child = await User.findOne({ tel: childTel, role: "student" });
        if (!child) {
            return res.status(404).json({ msg: "Child not found" });
        }

        parent.children.push(child._id);
        await parent.save();

        res.json({ msg: "Child added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

module.exports = {
    signup,
    login,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    addChildToParent,
    logout
};
