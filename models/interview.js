const mongoose = require('mongoose');

//schema for company and their interview, with list of students

const interviewSchema = new mongoose.Schema({

    companyName: {
        type : String,
        required : true
    },
    date: {
        type : Date,
        required : true
    },
    
    students: [
        {
            student: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Student",
                required: true,
            },  
            result: {
                type: String,
                enum: ["PASS", "FAIL", "Didn't Attempt", "On Hold"],
                default: "On Hold",
                trim: true,
                required: true,
                lowercase: true
            },
        },
    ],
}
,{timestamps: true});


const Interview = mongoose.model('Interview', interviewSchema);

module.exports = Interview;