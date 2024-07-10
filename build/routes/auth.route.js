"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/auth-state", auth_1.isAuthenticatedUser, auth_controller_1.authStateChange);
router.post("/login", auth_controller_1.login);
router.post("/register", auth_controller_1.register);
router.post("/refreshToken", auth_controller_1.genereteAccessToken);
router.post("/forgot-password", auth_controller_1.forgotPassword);
router.post("/password-recover", auth_controller_1.recoverPassword);
router.put("/reset", auth_1.isAuthenticatedUser, auth_controller_1.resetPassword);
exports.default = router;
