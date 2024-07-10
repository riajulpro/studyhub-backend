import { Router } from "express";
import { updateProgress } from "../controllers/progress.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();

router.patch("/update", isAuthenticatedUser, updateProgress);

export default router;
