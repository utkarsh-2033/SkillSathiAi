const express = require('express');
const { googleAuthController, signinController, signupController } = require('../controllers/auth.controller.js');
const router =express.Router();

router.post('/auth/signup',signupController);

router.post('/auth/signin',signinController);

router.post('/auth/google',googleAuthController);

module.exports = router;