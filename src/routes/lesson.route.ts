import express from "express";
import {
  createLesson,
  deleteLesson,
  getAllLessons,
  getOneLesson,
  updateLesson,
} from "../controllers/lesson.controller";
const router = express.Router();

router.post("/create", createLesson);
router.get("/get/all", getAllLessons);
router.get("/get/:id", getOneLesson);
router.patch("/update/:id", updateLesson);
router.delete("/delete/:id", deleteLesson);

export default router;
