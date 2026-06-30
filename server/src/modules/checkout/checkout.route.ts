import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { createOrder } from "./checkout.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";

const router = Router();

router.post("/", authenticate, asyncHandler(createOrder));

export default router;
