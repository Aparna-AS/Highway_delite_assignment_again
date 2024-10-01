"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoUri = 'mongodb+srv://sahuaparna1234:MDlGdPwBC3DDMtP1@cluster0.cxj2r.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
mongoose_1.default.connect(mongoUri)
    .then(() => {
    console.log('MongoDB Connected');
    mongoose_1.default.disconnect();
})
    .catch(err => {
    console.error('MongoDB connection error:', err);
});
