const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: { type: String, unique: true },
    password: String,
    address: String,
    tel: Number,
    role: String,
    gender: String,
    childTel: Number,
    children: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    avatar: String,
    speciality: String,
    status: String,
    cv: String,
    courses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    }],
    studentCourses: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course"
        },
        note: Number,
        evaluation: String,
    }]
});

// Hacher le mot de passe avant de sauvegarder un utilisateur
userSchema.pre("save", async function(next) {
    const user = this;

    // Si le mot de passe est modifié, on le hash
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }

    // Adapter les données en fonction du rôle
    if (user.role !== "teacher") user.courses = undefined;
    if (user.role !== "parent") user.children = undefined;
    if (user.role !== "student") user.studentCourses = undefined;

    next();
});

// Méthode statique pour comparer le mot de passe
userSchema.statics.comparePassword = async function(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
