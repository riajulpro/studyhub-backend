import express from "express";
import auth from "./auth.route";
import contactRoute from "./contactus.route";
import file from "./file.upload.route";
import user from "./user.route";
import payment from "./payment.routes";
import moduleRoutes from "./module.route";
import lessonRoutes from "./lesson.route";
import progressRoutes from "./progress.route";

const router = express.Router();

router.use("/user", user);
router.use("/auth", auth);
router.use("/file", file);
router.use("/payment", payment);
router.use("/contact", contactRoute);
router.use("/module", moduleRoutes);
router.use("/lesson", lessonRoutes);
router.use("/progress", progressRoutes);

export default router;
