import { Router } from "express";
import {
  getUserLessonProgress,
  getUserModuleProgress,
  updateProgress,
  updateUserLessonProgress,
  updateUserModuleProgress,
} from "../controllers/progress.controller";
import { isAuthenticatedUser } from "../middlewares/auth";
const router = Router();

router.patch("/update", isAuthenticatedUser, updateProgress);
router.patch("/update/lesson", isAuthenticatedUser, updateUserLessonProgress);
router.patch("/update/module", isAuthenticatedUser, updateUserModuleProgress);
router.get("/get/module", isAuthenticatedUser, getUserModuleProgress);
router.get("/get/lesson", isAuthenticatedUser, getUserLessonProgress);

export default router;
