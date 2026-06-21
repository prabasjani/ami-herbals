import { Router } from "express";

import { asyncHandler } from "../../common/utils/async-handler.js";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { UserRole } from "../user/user.types.js";

import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./category.controller.js";

const router = Router();

router.get("/", asyncHandler(getAll));

router.get("/:slug", asyncHandler(getOne));

router.post(
  "/",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(create),
);

router.patch(
  "/:id",
  authenticate,
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  asyncHandler(update),
);

router.delete(
  "/:id",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(remove),
);

export default router;
