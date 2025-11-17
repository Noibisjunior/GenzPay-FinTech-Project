const express = require('express');
const router = express.Router();
const {verifyToken} = require('../middlewares/authMiddleware.js');
const { login, 
        register, 
        forgotPassword,
        resetPassword,
        logOut} = require('../controller/auth.js');
        
const {me} = require('../controller/auth.js');

// Creating POST routes 
router.post('/login', login);
router.post('/register', register);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:tokens', resetPassword);
router.get('/me', verifyToken, me);
router.post('/logout', logOut);




module.exports = router;



// router.post('/api/auth/forgot-password', forgotPassword);
// router.post('/api/auth/reset-password/:token', resetPassword);

// Creating GET routes
// router.route('/api/auth/login').get(login);
// router.route('/api/auth/register').get(register);

