import { Router } from "express";
import { createStripePaymentIntent } from "../controllers/payment.controller";

const router = Router();
router.post("/create/intent", createStripePaymentIntent);
// router.post("/confirm", confirmPaymentController);

export default router;
