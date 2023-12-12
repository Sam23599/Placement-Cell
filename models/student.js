const mongoose = require('mongoose');
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/students/avatars");

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
    },
    gender: {
        type: String,
        required: true,
        lowercase: true,
        enum: ["Male", "Female", "Other"],
    },
    college: {
        type: String,
        required: true,
        trim: true,
    },
    status: {
        type: String,
        default: "Not Placed",
        trim: true,
        lowercase: true,
        enum: ["Placed", "Not Placed"],
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
    scores: {
        dsa_score: {
            type: Number,
            required: true,
            trim: true,
            lowercase: true
        },
        webd_score: {
            type: Number,
            required: true,
            trim: true,
            lowercase: true
        },
        react_score: {
            type: Number,
            required: true,
            trim: true,
            lowercase: true,
        },
    },
    avatar: {
        type: String,
    },
},
    {
        timestamps: true,
    });


//Setting up the Disk Storage Engine
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, path.join(__dirname, "..", AVATAR_PATH));
	},
	filename: function (req, file, cb) {
		cb(null, file.fieldname + "-" + Date.now());
	},
});

//Static Function :: Attaching the Disk Storage Engine to the Multer
studentSchema.statics.uploadedFile = multer({storage: storage}).single("avatar");
studentSchema.statics.filePath = AVATAR_PATH;

const Student = mongoose.model('Student', studentSchema);

module.exports = Student;