const express = require('express');
const router = express.Router();
const passport = require('passport');


const homeController = require("../controllers/home_controller");

// for testing only
router.post('/test', homeController.test)


// dashboard: pages
router.get('/', passport.checkAuthentication, homeController.home);
router.get('/studentsPage', passport.checkAuthentication, homeController.studentsPage);
router.get('/companiesPage', passport.checkAuthentication, homeController.companiesPage);
router.get('/updateStatus', passport.checkAuthentication, homeController.updateStatus);
router.get('/downloadReport', passport.checkAuthentication, homeController.downloadReport);


// operations on home page: student section
router.post('/updateStudent', passport.checkAuthentication, homeController.updateStudent);
router.post('/deleteStudent', passport.checkAuthentication, homeController.deleteStudent);



// operations on home page: interview section
router.post('/deleteInterview', passport.checkAuthentication, homeController.deleteInterview);
router.post('/createInterview', passport.checkAuthentication, homeController.createInterview);
router.post('/deleteStudentInterview', passport.checkAuthentication, homeController.deleteStudentInterview);
router.post('/updateStudentInterview', passport.checkAuthentication, homeController.updateStudentInterview);



// Add new entries to DB on separate new pages
router.post('/students/add-new-student', passport.checkAuthentication, homeController.createStudent);
router.post('/companies/add-new-company', passport.checkAuthentication, homeController.createCompany);



// profile 
const userController = require('../controllers/user_controller');
router.get("/user/profile/:id", passport.checkAuthentication, userController.profile);
router.post('/user/update/:id', passport.checkAuthentication, userController.profileUpdate);



// auth controllers
const authController = require('../controllers/auth_controller');
router.get('/auth/userAccess', authController.userForm);
router.post('/auth/signUp', authController.signUp);
router.post('/auth/login', passport.authenticate(
    'local',
    { failureRedirect: '/auth/userAccess' }
), authController.login);
router.get('/auth/signOut', authController.signOut);

module.exports = router;