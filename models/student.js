const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: [5, "Name must be at least 5 characters long"]
    },
    age: {
        type: Number,
        required: true,
        min: [12, "Age must be at least 12 Year Old"],
        max: [60, "Age must be at most 60 Years Old"],
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["male", "female", "other"],
    },
    college: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
    },
    status: {
        type: String,
        default: "not placed",
        trim: true,
        lowercase: true,
        enum: ["placed", "not placed"],
    },
    batch: {
        type: String,
        required: true,
        trim: true
    },
    interviews: [
        {
            company: {
                type: mongoose.mongoose.Schema.Types.ObjectId,
                ref: "Interview",
            },
            result: {
                type: String,
                trim: true,
                required: true,
                lowercase: true,
                enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold"],
            },
        },
    ],
    scores: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "CourseScore",
        },
    ],
    results: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Result",
        },
    ],
    avatar: {
        type: String,
    },
},
    {
        timestamps: true,
    });

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;