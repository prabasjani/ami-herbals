import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth.middleware.js";

import { createOrUpdate, findConfig } from "./delivery.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { UserRole } from "../user/user.types.js";

const router = Router();

/* Public */
router.get("/", asyncHandler(findConfig));

/* Super Admin */
router.post(
  "/",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(createOrUpdate),
);

export default router;
