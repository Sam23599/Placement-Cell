const express = require('express');
const router = express.Router();
const homeController = require("../controllers/home_controller");
const signInController = require("../controllers/sign_in_controller");

router.get('/', homeController.home);
router.get('/sign-in', signInController.signin)

// router.use('/users', require('./users'));
// router.use('/auth', require('./auth'));

module.exports = router;