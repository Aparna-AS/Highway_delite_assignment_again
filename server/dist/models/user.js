"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    resetPassword: { type: String },
    contactMode: { type: String, required: true, enum: ['email', 'phone'] },
    otp: { type: String },
    otpExpiry: { type: Date },
});
exports.User = mongoose_1.default.model('User', userSchema);
