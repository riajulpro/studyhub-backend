"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForgotPasswordToken = exports.createRefreshToken = exports.createAcessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createAcessToken = (user, expires) => {
    return jsonwebtoken_1.default.sign({ user }, process.env.JWT_ACCESS_SECRET, {
        expiresIn: expires,
    });
};
exports.createAcessToken = createAcessToken;
const createRefreshToken = (user) => {
    return jsonwebtoken_1.default.sign({ user }, process.env.JWT_REFRESH_SECRET, {
        expiresIn: "30 days",
    });
};
exports.createRefreshToken = createRefreshToken;
const createForgotPasswordToken = (email) => {
    return jsonwebtoken_1.default.sign({ email }, process.env.JWT_RESET_SECRET, {
        expiresIn: "5m",
    });
};
exports.createForgotPasswordToken = createForgotPasswordToken;
