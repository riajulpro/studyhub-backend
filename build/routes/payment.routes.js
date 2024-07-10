"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const payment_controller_1 = require("../controllers/payment.controller");
const router = (0, express_1.Router)();
router.post("/create/intent", payment_controller_1.createStripePaymentIntent);
// router.post("/confirm", confirmPaymentController);
exports.default = router;
