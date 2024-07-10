import express from "express";
import {
  createModule,
  deleteModule,
  getAllModules,
  getOneModule,
  updateModule,
} from "../controllers/module.controller";
const router = express.Router();

router.post("/create", createModule);
router.get("/get/all", getAllModules);
router.get("/get/:id", getOneModule);
router.patch("/update/:id", updateModule);
router.delete("/delete/:id", deleteModule);

export default router;
