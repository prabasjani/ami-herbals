import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  getAllUsers,
  getMe,
  getUser,
  removeUser,
  updateMe,
  updateRole,
} from "./user.controller.js";
import { UserRole } from "./user.types.js";

const router = Router();

router.get("/me", authenticate, asyncHandler(getMe));

router.patch("/me", authenticate, asyncHandler(updateMe));

router.get(
  "/",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getAllUsers),
);

router.get(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN),
  asyncHandler(getUser),
);

router.patch(
  "/:id/role",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(updateRole),
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(removeUser),
);

export default router;
