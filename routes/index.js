const express = require('express');
const router = express.Router();
const passport = require('passport');



// dashboard
const homeController = require("../controllers/home_controller");
router.get('/', passport.checkAuthentication, homeController.home);
router.get('/students/add-new', passport.checkAuthentication, homeController.students);
router.get('/interviews/add-new', passport.checkAuthentication, homeController.interviews);

// for testing only
router.post('/test', homeController.test);

// Add new entries
router.post('/students/add-new-student', passport.checkAuthentication, homeController.addStudent);
router.post('/interview/add-new-interview', passport.checkAuthentication, homeController.addInterview);


// auth controllers
const authController = require('../controllers/auth_controller');
router.get('/auth/userAccess', authController.userForm);
router.post('/auth/signUp', authController.signUp);
router.post('/auth/login', passport.authenticate(
    'local',
    { failureRedirect: '/auth/userAccess' }
), authController.login);
router.get('/auth/signOut', authController.signOut);


// profile 
const userController = require('../controllers/user_controller');
router.get("/user/profile/:id", passport.checkAuthentication, userController.profile);
router.post('/user/update/:id', passport.checkAuthentication, userController.profileUpdate);

module.exports = router;