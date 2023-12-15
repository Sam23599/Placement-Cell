const Student = require('../models/student');
const Interview = require('../models/interview');
const multer = require('multer');
const upload = multer();

module.exports.test = async function (req, res) {
    console.log('test middleware: ');
    console.log(req.body);
    console.log(req.file);
    return res.render('students', {
        title: "Students"
    });
}

module.exports.home = async function (req, res) {

    console.log("inside home controller");

    try {
        const allStudents = await Student.find({})
            .sort('-createdAt')
            .populate('interviews.company');

        const allInterviews = await Interview.find({})
            .populate('students.student');

        // console.log('students: ', allStudents)
        // console.log('interviews', interview)

        return res.render('home', {
            title: 'Placement Cell',
            students: allStudents,
            companies: allInterviews
        })
    } catch (error) {
        console.log('error on showing students/interview details');
        return;
    }
}

module.exports.updateStatus = async function (req, res) {
    try {
        const allStudents = await Student.find({})
            .sort('-createdAt')
            .populate('interviews.company');

        const allInterviews = await Interview.find({})
            .populate('students.student');

        return res.json({
            success: true,
            message: 'Updated Students and Interviews data',
            students: allStudents,
            companies: allInterviews
        });
    } catch (error) {
        console.error('Error on fetching data from DB:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}



// Student Section 

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

module.exports.deleteStudent = async function (req, res) {
    try {
        const studentIdToRemove = req.body.studentId;
        const student = await Student.findOne({ _id: studentIdToRemove });

        const interviews = student.interviews;
        for (const oneInterview of interviews) {
            const updatedInterview = await Interview.findOneAndUpdate(
                { '_id': oneInterview.company },
                { $pull: { 'students': { 'student': studentIdToRemove } } },
                { new: true }
            );
        }
        await Student.deleteOne({ _id: studentIdToRemove });
        console.log('Student Deleted Successfully');

        const interviewsAll = await Interview.find({})
            .populate('students.student');

        return res.status(200).json({
            message: "Student deleted successfully",
            companies: interviewsAll,
            removedStudentId: studentIdToRemove
        })

    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error during Student deletion");
    }
}




// Interview Section 

module.exports.deleteInterview = async function (req, res) {

    try {
        const companyIdToRemove = req.body.companyId;
        const interview = await Interview.findOne({ _id: companyIdToRemove })

        const students = interview.students;
        for (const oneStudent of students) {
            const updatedStudent = await Student.findOneAndUpdate(
                { "_id": oneStudent.student },
                { $pull: { "interviews": { "company": companyIdToRemove } } },
                { new: true }
            );
            // console.log(updatedStudent);
        };
        await Interview.deleteOne({ _id: companyIdToRemove });
        console.log('Interview Deleted Successfully');

        const studentsAll = await Student.find({})
            .sort('-createdAt')
            .populate('interviews.company');

        return res.status(200).json({
            message: "Interview deleted successfully",
            students: studentsAll,
            deletedCompanyID: companyIdToRemove
        });

    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error during Interview deletion");
    }
}

module.exports.createInterview = async function (req, res) {
    try {
        const company = await Interview.findOne({ _id: req.body.companyId });
        const student = await Student.findOne({ _id: req.body.studentId });

        // Check if the student is already associated with the company
        const existingInterview = student.interviews.find(interview => String(interview.company) === req.body.companyId);

        if (!existingInterview) {
            company.students.push({
                student: req.body.studentId,
                result: req.body.result,
            });

            student.interviews.push({
                company: req.body.companyId,
                result: req.body.result,
            });

            await company.save();
            await student.save();

            const updatedCompany = await Interview.findOne({ _id: req.body.companyId });
            const updatedStudent = await Student.findOne({ _id: req.body.studentId });

            return res.status(200).json({
                message: "Interview created successfully",
                company: updatedCompany,
                student: updatedStudent,
                result: req.body.result
            });
        } else {
            return res.status(400).json({
                message: "Interview already exists for this student and company combination",
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send("Internal Server Error during Interview creation");
    }
};

module.exports.deleteStudentInterview = async function (req, res) {
    console.log(req.body);
    try {
        const candidateId = req.body.candidateId;
        const companyId = req.body.companyId;

        const company = await Interview.findOneAndUpdate(
            { _id: companyId },
            { $pull: { 'students': { 'student': candidateId } } },
            { new: true }
        );
        const student = await Student.findOneAndUpdate(
            { _id: candidateId },
            { $pull: { 'interviews': { 'company': companyId } } },
            { new: true }
        );

        return res.status(200).json({
            message: "Student Interview Deleted successfully",
            student: student,
            company: company
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send("Internal Server Error during removing Student from Company's Interview");
    }
}

module.exports.updateStudentInterview = async function (req, res) {
    console.log(req.body);
    try {

        const updatedStudent = await Student.findOneAndUpdate(
            { _id: req.body.studentId, 'interviews.company': req.body.companyId },
            { $set: { 'interviews.$.result': req.body.result } },
            { new: true }
        );
        const updatedInterview = await Interview.findOneAndUpdate(
            { _id: req.body.companyId, 'students.student': req.body.studentId },
            { $set: { 'students.$.result': req.body.result } },
            { new: true }
        );

        return res.json({
            success: true,
            message: 'Student Interview updated successfully',
            result: req.body.result,
            student: updatedStudent,
            company: updatedInterview
        });

    } catch (error) {
        console.error('Error on updating student\'s interview:', error);
        return res.status(500).json({
            success: false,
            error: 'Internal Server Error',
        });
    }
}




// Student Page - 

module.exports.studentsPage = async function (req, res) {
    console.log("inside students controller");
    return res.render('students', {
        title: "Students"
    });
}

module.exports.createStudent = async function (req, res) {

    console.log('Inside create student controller');

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




// Company Page - 

module.exports.companiesPage = async function (req, res) {
    console.log("inside interviews controller");
    return res.render('interviews', {
        title: "Interviews"
    });
}

module.exports.createCompany = async function (req, res) {
    console.log('Inside create company controller');

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




// Download Report

module.exports.downloadReport = async function (req, res) {
    try {
        
    } catch (error) {
        
    }
}