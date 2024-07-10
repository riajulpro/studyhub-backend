import express from "express";
import { deleteFile, fileUpload } from "../controllers/file.controller";
import upload from "../utils/fileUpload";
const router = express.Router();

router.post("/upload", upload.single("file"), fileUpload);
router.delete("/delete/:fileName", deleteFile);
export default router;
