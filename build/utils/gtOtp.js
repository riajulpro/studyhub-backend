"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtp = void 0;
const generateOtp = () => {
    return Math.floor(10000 + Math.random() * 90000);
};
exports.generateOtp = generateOtp;
