const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Course = require('../models/course');
require('dotenv').config();
const mongoose = require('mongoose')
// Inscription d'un nouvel utilisateur
const signup = async (req, res) => {
    const { firstName, lastName, email, password, role, gender, address, tel } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ msg: "User already exists" });
        }

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
            isValidated: false,
        });

        await newUser.save();
        res.json({ msg: "User created successfully. Awaiting admin validation.", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Fonction pour valider un utilisateur
const validateUser = async (req, res) => {
    const { userId } = req.params;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        if (user.isValidated) {
            return res.status(400).json({ msg: "User is already validated" });
        }

        user.isValidated = true;
        await user.save();

        res.json({ msg: "User validated successfully", user });
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

        const user = await User.findOne({ email, role });
        if (!user) {
            return res.status(404).json({ message: "User not found or role mismatch" });
        }

        if (!user.isValidated) {
            return res.status(403).json({ msg: "Your account is not validated yet. Please wait for admin approval." });
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

// Fonction de logout
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
const getUserById = async (req, res) => {
    const userId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ msg: "Invalid user ID" });
    }

    try {
        const user = await User.findById(userId);

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

// Récupérer les utilisateurs en attente de validation
const getPendingUsers = async (req, res) => {
    try {
        const users = await User.find({ isValidated: false });
        res.json(users);
    } catch (error) {
        res.status(500).json({ msg: "Server error", error: error.message });
    }
};

// Suppression d'un utilisateur par ID
const deleteUserById = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'Utilisateur supprimé' });
    } catch (error) {
        res.status(500).json({ message: 'Erreur serveur' });
    }
};

// Login Admin
const loginAdmin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: "Admin not found" });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({ msg: "Access denied, not an admin" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: "Invalid credentials" });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.json({ token, user: { id: user._id, email: user.email, role: user.role } });
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
    logout,
    validateUser,
    getPendingUsers,
    deleteUserById,
    loginAdmin,
};
