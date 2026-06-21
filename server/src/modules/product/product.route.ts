import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth.middleware.js";

import { UserRole } from "../user/user.types.js";

import {
  create,
  feature,
  getAll,
  getByCategory,
  getFeatured,
  getOne,
  remove,
  search,
  stock,
  update,
  updateStatus,
} from "./product.controller.js";

const router = Router();

// Public Routes
router.get("/", getAll);

router.get("/featured", getFeatured);

router.get("/search", search);

router.get("/category/:slug", getByCategory);

router.get("/:slug", getOne);

// Protected Routes
router.use(authenticate);

// Admin + Super Admin
router.post("/", authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), create);

router.patch("/:id", authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN), update);

router.patch(
  "/:id/status",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  updateStatus,
);

router.patch(
  "/:id/feature",
  authorize(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  feature,
);

// Super Admin Only
router.patch("/:id/stock", authorize(UserRole.SUPER_ADMIN), stock);

router.delete("/:id", authorize(UserRole.SUPER_ADMIN), remove);

export default router;
