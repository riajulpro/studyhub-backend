import express from "express";
import {
  authStateChange,
  forgotPassword,
  genereteAccessToken,
  login,
  recoverPassword,
  register,
  resetPassword,
} from "../controllers/auth.controller";
import { isAuthenticatedUser } from "../middlewares/auth";

const router = express.Router();

router.get("/auth-state", isAuthenticatedUser, authStateChange);
router.post("/login", login);
router.post("/register", register);
router.post("/refreshToken", genereteAccessToken);
router.post("/forgot-password", forgotPassword);
router.post("/password-recover", recoverPassword);
router.put("/reset", isAuthenticatedUser, resetPassword);

export default router;
