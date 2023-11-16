const express = require('express');
const router = express.Router();
const passport = require('passport');

// dashboard
const homeController = require("../controllers/home_controller");
router.get('/', passport.checkAuthentication, homeController.home);

// user auth controller
const authController = require('../controllers/auth_controller');
router.get('/auth/userAccess', authController.userForm);
router.post('/auth/signUp', authController.signUp);
router.post('/auth/login', passport.authenticate(
    'local',
    { failureRedirect: '/auth/userAccess' }
), authController.login);
router.get('/auth/signOut', authController.signOut);

module.exports = router;