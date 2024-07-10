"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.patch("/update", auth_1.isAuthenticatedUser, progress_controller_1.updateProgress);
exports.default = router;
