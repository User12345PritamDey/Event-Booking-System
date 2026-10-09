const express = require('express');
const router = express.Router();

const {
    registerUser,
    login,
    verifyOTP,
    forgotPassword,
    resetPassword
} = require('./../controller/authController.js');

router.post('/register', registerUser);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/test', (req, res) => {
    res.json({ message: 'Auth route is working' });
});
console.log("AUTH ROUTES LOADED");
module.exports = router;
