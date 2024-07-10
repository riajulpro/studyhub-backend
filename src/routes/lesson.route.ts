import express from "express";
import {
  createLesson,
  deleteLesson,
  getAllLessons,
  getOneLesson,
  updateLesson,
} from "../controllers/lesson.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticatedUser, isAdmin, createLesson);
router.get("/get/all", isAuthenticatedUser, getAllLessons);
router.get("/get/:id", isAuthenticatedUser, getOneLesson);
router.patch("/update/:id", isAuthenticatedUser, isAdmin, updateLesson);
router.delete("/delete/:id", isAuthenticatedUser, isAdmin, deleteLesson);

export default router;
