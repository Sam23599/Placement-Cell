//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const AVATAR_PATH = path.join("/uploads/users/avatars");

//Create the DB Schema
const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			trim: true,
			// minlength: [3, "Name must be at least 3 Characters Long"],
		},
		email: {
			type: String,
			required: true,
			unique: true,
		},
		password: {
			type: String,
			required: true,
		},
		avatarPath: {
			type: String,
		},
	},
	{
		timestamps: true,
	}
);

//BACKEND VALIDATION :: Filter Function for Avatar Uploading
const fileTypeFilter = (req, file, cb) => {
	//Accept the file if it is an Image & less than 3MB
	const allowedTypes = [
		"image/jpeg",
		"image/png",
		"image/jpg",
		"image/gif",
		"image/svg",
	];
	const sizeError = "File too large: Max size is 3MB ";
	const typeError = "File Type not Supported ";

	if (allowedTypes.includes(file.mimetype)) {
		if (file.size > 1024 * 1024 * 3) cb(new Error(sizeError), false);
		else cb(null, true);
	} else {
		cb(new Error(typeError), false);
	}
};

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
userSchema.statics.uploadedFile = multer({
	storage: storage,
	fileFilter: fileTypeFilter,
}).single("avatar");

userSchema.statics.filePath = AVATAR_PATH;

const User = mongoose.model("User", userSchema);
module.exports = User;