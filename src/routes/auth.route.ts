import express from "express";
import {
  authStateChange,
  facebookSingIn,
  forgotPassword,
  googleSingIn,
  login,
  recoverPassword,
  register,
  resetPassword,
  sendOTP,
  verifyOTP,
} from "../controllers/auth.controller";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

router.get("/u/get", isAuthenticatedUser, authStateChange);
router.post("/login", login);
router.post("/register", register);
router.post("/facebook", facebookSingIn);
router.post("/google", googleSingIn);
router.post("/forgot-password", forgotPassword);
router.post("/password-recover", recoverPassword);
router.post("/verify", verifyOTP);
router.post("/send", sendOTP);
router.put("/reset", isAuthenticatedUser, resetPassword);

export default router;
