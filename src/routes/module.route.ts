import express from "express";
import {
  createModule,
  deleteModule,
  getAllModules,
  getOneModule,
  updateModule,
} from "../controllers/module.controller";
import { isAdmin, isAuthenticatedUser } from "../middlewares/auth";
const router = express.Router();

router.post("/create", isAuthenticatedUser, isAdmin, createModule);
router.get("/get/all", isAuthenticatedUser, getAllModules);
router.get("/get/:id", isAuthenticatedUser, getOneModule);
router.patch("/update/:id", isAuthenticatedUser, isAdmin, updateModule);
router.delete("/delete/:id", isAuthenticatedUser, isAdmin, deleteModule);

export default router;
