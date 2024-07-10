"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.recoverPassword = exports.forgotPassword = exports.resetPassword = exports.login = exports.register = exports.genereteAccessToken = exports.authStateChange = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userModel_1 = __importDefault(require("../models/userModel"));
const catchAsyncError_1 = require("../utils/catchAsyncError");
const userModel_2 = __importDefault(require("../models/userModel"));
const jwtToken_1 = require("../utils/jwtToken");
const sendMessage_1 = __importDefault(require("../utils/sendMessage"));
const sendResponse_1 = __importDefault(require("../utils/sendResponse"));
exports.authStateChange = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { user } = req;
    res.status(200).json({
        success: true,
        message: "Authenticate user",
        data: user,
    });
}));
exports.genereteAccessToken = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const getToken = req.header("Authorization");
    if (!getToken)
        return res.status(400).json({ msg: "Invalid Authentication." });
    const refreshToken = getToken.split(" ")[1];
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, refreshTokenSecret);
        const user = decoded.user;
        const accessTOkenPayload = {
            email: user.email,
            _id: user._id,
        };
        const isExistUser = yield userModel_2.default.findById(user._id);
        if (!isExistUser) {
            return (0, sendResponse_1.default)(res, {
                success: false,
                data: null,
                message: "User not found",
                statusCode: 404,
            });
        }
        const newAccessToken = (0, jwtToken_1.createAcessToken)(accessTOkenPayload, "1h");
        res.json({
            success: true,
            message: "Successfully retrive access token",
            data: isExistUser,
            accessToken: newAccessToken,
        });
    }
    catch (error) {
        console.error("Error decoding or verifying refresh token:", error);
        res.status(403).json({ message: "Invalid refresh token" });
    }
}));
// register user
exports.register = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { body } = req;
    let otp = 0;
    const isExist = yield userModel_1.default.findOne({ email: body.email });
    if (isExist) {
        return res.json({
            success: false,
            message: `User already exist in ${body.email}`,
        });
    }
    const hashPass = yield bcryptjs_1.default.hash(body.password, 15);
    const result = yield userModel_1.default.create(Object.assign(Object.assign({}, body), { password: hashPass }));
    res.status(200).json({
        success: true,
        message: "User created successfully",
        data: null,
    });
}));
// login user
exports.login = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const user = yield userModel_1.default.findOne({ email: email });
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: `User not found for ${email}` });
    }
    if (!password) {
        return res.json({
            message: "no password found",
            data: null,
            success: false,
        });
    }
    const isMatchedPass = yield bcryptjs_1.default.compare(password, user === null || user === void 0 ? void 0 : user.password);
    if (!isMatchedPass) {
        return res
            .status(203)
            .json({ message: "Wrong password", success: false, data: null });
    }
    const tokenPayload = {
        _id: user._id,
        email: user.email,
    };
    const accessToken = (0, jwtToken_1.createAcessToken)(tokenPayload, "7d");
    const refreshToken = (0, jwtToken_1.createRefreshToken)(tokenPayload);
    const _a = user.toObject(), { password: pass } = _a, resUser = __rest(_a, ["password"]);
    res.json({
        success: true,
        accessToken,
        refreshToken,
        data: resUser,
    });
}));
// reset password
exports.resetPassword = (0, catchAsyncError_1.catchAsyncError)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { password, oldPassword, email } = req.body;
    const user = req.user;
    if (!password || !oldPassword || !email) {
        return res.json({
            message: "password, oldPassword and email => is required",
        });
    }
    const theUser = yield userModel_1.default.findOne({ email });
    // check if there no user
    if (!theUser) {
        return res.json({ message: `no user find on ${email}` });
    }
    // check is the email is same or not
    if (theUser.email !== user.email) {
        return res
            .status(403)
            .json({ message: "Email didn't matched=> forbiden access" });
    }
    // varify old password
    const isOk = yield bcryptjs_1.default.compare(oldPassword, theUser.password);
    if (!isOk) {
        return res.json({ message: "password didn't matched", success: false });
    }
    // create new hash password
    const newPass = yield bcryptjs_1.default.hash(password, 15);
    // update the new
    const updatePassword = yield userModel_1.default.findOneAndUpdate({ email }, {
        $set: {
            password: newPass,
        },
    });
    res.json({
        message: "password Updated",
        success: true,
        user: Object.assign(Object.assign({}, updatePassword === null || updatePassword === void 0 ? void 0 : updatePassword.toObject()), { password: "****" }),
    });
}));
// forgot-password controller
exports.forgotPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ success: false, message: "No user found with this email!" });
    }
    const token = (0, jwtToken_1.createForgotPasswordToken)(user.email);
    const url = process.env.FRONTEND_BASE_URL || "https://nexusnova-frontend.vercel.app";
    (0, sendMessage_1.default)("legendxpro123455@gmail.com", email, "Reset your password - Nexusnova", `<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; color: #333; margin: 0; padding: 0;">
    <div style="width: 100%; max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border: 1px solid #ddd;">
        <div style="text-align: center; background-color: #00466a; color: white; padding: 10px;">
            <h1 style="margin: 0;">Password Reset</h1>
        </div>
        <div style="padding: 20px;">
            <p>Hello,${(user === null || user === void 0 ? void 0 : user.firstName) || ""}</p>
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <div style="text-align: center; margin: 20px 0;">
                <a href="${url}/reset/${token}" style="display: inline-block; padding: 10px 20px; background-color: #00466a; color: white; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            <p>If you did not request a password reset, please ignore this email.</p>
            <p>Thanks,</p>
            <p>Nexusnova</p>
        </div>
        <div style="text-align: center; background-color: #f1f1f1; color: #555; padding: 10px;">
            <p style="margin: 0;">&copy; 2024 Nexusnova. All rights reserved.</p>
        </div>
    </div>
</div>`);
    res.status(200).json({
        success: true,
        message: "Check your email to recover the password",
    });
}));
// Resetting new password
exports.recoverPassword = (0, catchAsyncError_1.catchAsyncError)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { token, password } = req.body;
    if (!token || !password) {
        return res.status(400).json({ error: "Token and password are required" });
    }
    let decodedPayload = "";
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_RESET_SECRET);
        decodedPayload = decoded;
    }
    catch (_a) {
        return (0, sendResponse_1.default)(res, {
            statusCode: 401,
            success: false,
            data: null,
            message: "Ivalid authentication, try again",
        });
    }
    const email = decodedPayload.email;
    const user = yield userModel_1.default.findOne({ email });
    if (!user) {
        return res
            .status(400)
            .json({ error: "Password reset session exipred. Try again" });
    }
    const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
    user.password = hashedPassword;
    yield user.save();
    res.status(200).json({
        success: true,
        message: "Password has been successfully reset",
        data: null,
    });
}));
