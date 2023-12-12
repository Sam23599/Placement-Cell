const Student = require('../models/student');
const Interview = require('../models/interview');
const multer = require('multer');
const upload = multer();

module.exports.home = async function (req, res) {

    console.log("inside home controller");

    try {
        const students = await Student.find({})
            .sort('-createdAt')
            .populate('interviews.company');

        const interview = await Interview.find({})
            .populate('students.student');

        // console.log('students: ', students)
        // console.log('interviews', interview)

        return res.render('home', {
            title: 'Placement Cell',
            students: students,
            companies: interview
        })
    } catch (error) {
        console.log('error on showing students/interview details');
        return;
    }
}

module.exports.students = async function (req, res) {
    console.log("inside students controller");
    return res.render('students', {
        title: "Students"
    });
}

module.exports.addStudent = async function (req, res) {

    console.log('Inside add student controller');

    try {

        // Important: Not using the below stub right now due to some unknown issue with multer and file upload error with student.ejs's form
        /*
        // Multer handles field: 'avatar' file upload, populates `req.file` with uploaded file details.
        
        await new Promise((resolve, reject) => {
            Student.uploadedFile(req, res, (err) => {
                if (err) {
                    console.log('Multer Error in user controller', err);
                    reject(err);
                }
                else {
                    resolve();
                }
            })
        });
        */

        let student = await Student.findOne({ name: req.body.name });

        if (!student) {
            console.log('Creating new Student');

            // Call the uploadedFile static function to handle file upload
            await Student.uploadedFile(req, res, async function (err) {
                if (err) {
                    console.error('Error parsing form data:', err);
                    return res.status(500).json({ error: 'Error parsing form data' });
                }

                const newStudent = await Student.create({
                    name: req.body.name,
                    age: req.body.age,
                    gender: req.body.gender,
                    college: req.body.college,
                    status: req.body.status,
                    batch: req.body.batch,
                    interviews: [],
                    'scores.dsa_score': req.body.dsa_score,
                    'scores.webd_score': req.body.webd_score,
                    'scores.react_score': req.body.react_score,
                    avatar: req.body.avatar ||
                        (req.body.gender === "Male"
                            ? "images/Male-avatar.svg"
                            : "images/Female-avatar.svg"),
                });

                console.log('New Student created:', newStudent);
                return res.redirect('back');
            });
        }
        else {
            console.log('Student already exists');
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error on creating student:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports.updateStudent = async function (req, res) {
    console.log('Inside update student controller');
    console.log(req.body);

    try {
        let student = await Student.findOne({ _id: req.body.id });

        if (student) {
            student = await Student.findOneAndUpdate(
                { _id: req.body.id },
                {
                    $set: {
                        ...req.body,
                        'scores.dsa_score': req.body.dsa_score,
                        'scores.webd_score': req.body.webd_score,
                        'scores.react_score': req.body.react_score,
                        avatar: req.body.gender === "male" ? "images/Male-avatar.svg" : "images/Female-avatar.svg",
                    },
                },
                { new: true } 
            );

            return res.json({
                success: true,
                message: 'Student updated successfully',
                data: student,
            });
        } else {
            console.log('Student not found');
            return res.status(404).json({
                success: false,
                message: 'Student not found',
            });
        }
    } catch (error) {
        console.error('Error on updating student:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}

module.exports.deleteStudent = async function (req, res){

}

module.exports.test = async function (req, res) {
    console.log('test middleware: ');
    console.log(req.body);
    console.log(req.file);
    return res.render('students', {
        title: "Students"
    });
}

module.exports.interviews = async function (req, res) {
    console.log("inside interviews controller");
    return res.render('interviews', {
        title: "Interviews"
    });
}

module.exports.addInterview = async function (req, res) {
    console.log('Inside add interview controller');

    try {
        let interview = await Interview.findOne({ companyName: req.body.company });
        if (!interview) {
            // Create a new interview and save it to the database
            const newInterview = await Interview.create({
                companyName: req.body.company,
                date: req.body.date,
                students: []
            })

            console.log('New Company Interview crearted', newInterview);
            return res.redirect('back');
        } else {
            console.log('Same compnay interview exists already');
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error on creating/updating Interview:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }

}

module.exports.deleteInterview = async function(req, res){
    
}