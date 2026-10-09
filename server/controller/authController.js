const User = require('./../models/User.js');
const OTP = require('../models/OTP.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {
    sendBookingEmail,
    sendOTPEmail
} = require('../utils/emails.js');

const generateToken = (id, role) => {
    return jwt.sign(
        { id, role },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

const generateOTP = () => {
    return Math.floor(
        100000 + Math.random() * 900000
    ).toString();
};

// Password validation
const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;


// Register User
exports.registerUser = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        // Password validation
        if (!passwordRegex.test(password)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character.'
            });
        }

        // Check if user already exists
        let userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            password,
            salt
        );

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
            isVerified: false
        });

        // Generate OTP
        const otp = generateOTP();

        console.log(`OTP for ${email}: ${otp}`);

        await OTP.create({
            email,
            otp,
            action: 'account_verification'
        });

        await sendOTPEmail(
            email,
            otp,
            'account_verification'
        );

        res.status(201).json({
            message:
                'User registered successfully. Please check your email for OTP to verify your account.',
            email: user.email
        });

    } catch (err) {

        console.log(err);

        res.status(500).json({
            error: 'Server Down'
        });
    }
};


// Login logic
exports.login = async (req, res) => {

    try {

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message:
                    'Invalid credentials, Please Sign Up first'
            });
        }

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }

        if (!user.isVerified && user.role !== 'admin') {

            const otp = generateOTP();

            await OTP.findOneAndDelete({
                email: user.email,
                action: 'account_verification'
            });

            await OTP.create({
                email: user.email,
                otp,
                action: 'account_verification'
            });

            await sendOTPEmail(
                user.email,
                otp,
                'account_verification'
            );

            return res.status(403).json({
                message: 'Account not verified',
                needsVerification: true,
                email: user.email
            });
        }

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(
                user.id,
                user.role
            )
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// Verify OTP
exports.verifyOTP = async (req, res) => {

    try {

        const { email, otp } = req.body;

        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'account_verification'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            });
        }

        const user = await User.findOneAndUpdate(
            { email },
            { isVerified: true },
            { new: true }
        );

        await OTP.deleteOne({
            _id: validOTP._id
        });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(
                user.id,
                user.role
            )
        });

    } catch (error) {

        res.status(500).json({
            message: 'Server Error'
        });
    }
};


// Forgot Password - Send OTP
exports.forgotPassword = async (req, res) => {

    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Delete previous password reset OTP
        await OTP.findOneAndDelete({
            email,
            action: 'password_reset'
        });

        // Generate new OTP
        const otp = generateOTP();

        console.log(
            `Password Reset OTP for ${email}: ${otp}`
        );

        // Save OTP
        await OTP.create({
            email,
            otp,
            action: 'password_reset'
        });

        // Send OTP through email
        await sendOTPEmail(
            email,
            otp,
            'password_reset'
        );

        res.json({
            message: 'OTP sent to your email'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};


// Reset Password
exports.resetPassword = async (req, res) => {

    try {

        const {
            email,
            otp,
            newPassword
        } = req.body;

        // Password validation
        if (!passwordRegex.test(newPassword)) {
            return res.status(400).json({
                message:
                    'Password must be at least 8 characters and contain one uppercase letter, one lowercase letter, one number, and one special character.'
            });
        }

        // Find valid OTP
        const validOTP = await OTP.findOne({
            email,
            otp,
            action: 'password_reset'
        });

        if (!validOTP) {
            return res.status(400).json({
                message: 'Invalid or expired OTP'
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10);

        const hashedPassword = await bcrypt.hash(
            newPassword,
            salt
        );

        // Update password
        user.password = hashedPassword;

        await user.save();

        // Delete OTP after successful password reset
        await OTP.deleteOne({
            _id: validOTP._id
        });

        res.json({
            message: 'Password reset successfully'
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Server Error',
            error: error.message
        });
    }
};