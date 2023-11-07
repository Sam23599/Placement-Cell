//Create the same instance of mongoose which is used in the MongoDB configuration inside config
const mongoose = require("mongoose");

//Create the DB Schema
const courseScoreSchema = new mongoose.Schema(
	{
		student: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Student",
		},
		dsa_score: {
            type : Number,
            required : true,
            trim: true,
			lowercase: true
        },
        webd_score: {
            type : Number,
            required : true,
            trim: true,
			lowercase: true
        },
        react_score: {
            type : Number,
            required : true,
            trim: true,
			lowercase: true,
        },
	},
	{
		timestamps: true,
	}
);

//Create a Model/Collection to populate the data with the same name for the schema in the DB
const CourseScore = mongoose.model("CourseScore", courseScoreSchema);

//Export the Model
module.exports = CourseScore;