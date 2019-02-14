const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const isAuth = require('../middleware/is-auth');

//login routes
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);

//signup routes
router.get('/signup', authController.getSignup);
router.post('/signup', authController.postSignup);

//logout routes
router.get('/logout', isAuth, authController.logout);

module.exports = router;