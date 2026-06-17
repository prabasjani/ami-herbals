import { Router } from "express";

import { healthCheck } from "./health.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";

const router = Router();

router.get("/", asyncHandler(healthCheck));

export default router;
