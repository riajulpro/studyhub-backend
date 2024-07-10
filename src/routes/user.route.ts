import express from "express";
import {
  getUser,
  updatePrivacy,
  updateUserInfo,
} from "../controllers/user.controller";
const router = express.Router();

router.get("/get/:id", getUser);
router.put("/privacy/:id", updatePrivacy);
router.patch("/update/:id", updateUserInfo);

export default router;
