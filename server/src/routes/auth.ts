import express from 'express';
import { signup, login, verifyOtp,  } from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.post('/verify-otp',verifyOtp);  // Add verifyOtp route

export default router;
