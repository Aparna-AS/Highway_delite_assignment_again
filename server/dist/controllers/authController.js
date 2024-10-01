"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../models/user");
const bcrypt_1 = __importDefault(require("bcrypt"));
const nodemailer_1 = __importDefault(require("nodemailer"));
// Generate random 6-digit OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
// Set up nodemailer for Gmail SMTP
const transporter = nodemailer_1.default.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'appy.vampire15@gmail.com',
        pass: 'nzcn soby vvwx yynn',
    },
});
// Signup function with OTP sending
exports.signup = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password, contactMode } = req.body;
        // Check if the user already exists
        const existingUser = yield user_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        // Create a new user with hashed password, OTP, and expiry
        const user = new user_1.User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            otp,
            otpExpiry,
            contactMode,
        });
        yield user.save();
        const mailOptions = {
            from: 'appy.vampire15@gmail.com',
            to: email,
            subject: 'Your OTP for Signup',
            html: `<p>Your OTP for signup is: <b>${otp}</b></p>`,
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                res.status(500).json({ message: 'Error sending OTP' });
                return;
            }
            res.json({ message: 'User registered. Please verify OTP', email });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// OTP verification function
exports.verifyOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, otp } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        // Check if OTP is correct and not expired
        if (user.otp === otp && user.otpExpiry && user.otpExpiry > new Date()) {
            user.otp = undefined;
            user.otpExpiry = undefined;
            yield user.save();
            res.status(200).json({ message: 'OTP verified successfully' });
        }
        else {
            // Remove user if OTP is wrong or expired
            yield user_1.User.deleteOne({ email });
            res.status(400).json({ message: 'Invalid or expired OTP. User removed.' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Resend OTP
exports.resendOtp = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
        user.otp = otp;
        user.otpExpiry = otpExpiry;
        yield user.save();
        const mailOptions = {
            from: 'appy.vampire15@gmail.com',
            to: email,
            subject: 'Resend OTP for Signup',
            html: `<p>Your OTP for signup is: <b>${otp}</b></p>`,
        };
        transporter.sendMail(mailOptions, (error) => {
            if (error) {
                res.status(500).json({ message: 'Error sending OTP' });
                return;
            }
            res.status(200).json({ message: 'OTP resent successfully', email });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
// Login function (unchanged)
exports.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_1.User.findOne({ email });
        if (user && (yield bcrypt_1.default.compare(password, user.password))) {
            res.json({ message: 'Login successful' });
        }
        else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});
