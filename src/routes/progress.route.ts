import { Router } from "express";
import { updateProgress } from "../controllers/progress.controller";
const router = Router();

router.patch("/update", updateProgress);

export default router;
