import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPassword: { type: String },
  contactMode: { type: String, required: true, enum: ['email', 'phone'] }, // Drop-down with email or phone
  otp: { type: String },
  otpExpiry: { type: Date }, // OTP expiry time
});

export const User = mongoose.model('User', userSchema);
