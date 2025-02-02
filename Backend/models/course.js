const mongoose = require("mongoose");

const courseSchema = mongoose.Schema({
    courseName: String,
    duration: String,
    teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    description: String,
    avatar: String,
    students: [{
        studentId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        note: Number,
        evaluation: String,
    }]
});

const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
