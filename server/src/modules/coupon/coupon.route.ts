import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth.middleware.js";

import {
  apply,
  create,
  findAll,
  findById,
  hardDelete,
  remove,
  softDelete,
  update,
} from "./coupon.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { UserRole } from "../user/user.types.js";

const router = Router();

/* User */
router.post("/apply", authenticate, asyncHandler(apply));

router.delete("/remove", authenticate, asyncHandler(remove));

/* Public */
router.get("/", asyncHandler(findAll));

router.get("/:id", asyncHandler(findById));

/* Super Admin */
router.post(
  "/",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(create),
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(update),
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(softDelete),
);

router.delete(
  "/:id/permanent",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(hardDelete),
);

export default router;
