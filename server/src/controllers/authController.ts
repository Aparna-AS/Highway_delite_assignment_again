import { Request, Response } from 'express';
import { User } from '../models/user';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

// Generate random 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Set up nodemailer for Gmail SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: 'appy.vampire15@gmail.com', // Your Demo Gmail address
    pass: 'nzcn soby vvwx yynn', // Your Gmail password (or app-specific password)
  },
});

// Signup function with OTP sending
export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { firstName, lastName, email, password, contactMode } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: 'User already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes

    // Create a new user with hashed password, OTP, and expiry
    const user = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      otp,
      otpExpiry,
      contactMode,
    });
    await user.save();

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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// OTP verification function
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Check if OTP is correct and not expired
    if (user.otp === otp && user.otpExpiry && user.otpExpiry > new Date()) {
      user.otp = undefined;
      user.otpExpiry = undefined;
      await user.save();
      res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      // Remove user if OTP is wrong or expired
      await User.deleteOne({ email });
      res.status(400).json({ message: 'Invalid or expired OTP. User removed.' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Resend OTP
export const resendOtp = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // OTP expires in 10 minutes
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

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
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Login function (unchanged)
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};
