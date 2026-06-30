import { Router } from "express";

import { authenticate, authorize } from "../../middleware/auth.middleware.js";

// import * as OrderController from "./order.controller.js";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { UserRole } from "../user/user.types.js";
import { cancelOrderHandler, getMyOrdersHandler, getOrderByIdHandler, getOrdersHandler, updateOrderStatusHandler, updatePaymentStatusHandler } from "./order.controller.js";

const router = Router();

/* ---------- Customer ---------- */

router.get(
  "/my-orders",
  authenticate,
  asyncHandler(getMyOrdersHandler),
);

router.get("/:id", authenticate, asyncHandler(getOrderByIdHandler));

router.patch(
  "/:id/cancel",
  authenticate,
  asyncHandler(cancelOrderHandler),
);

/* ---------- Admin ---------- */

router.get(
  "/",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(getOrdersHandler),
);

router.patch(
  "/:id/status",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(updateOrderStatusHandler),
);

router.patch(
  "/:id/payment",
  authenticate,
  authorize(UserRole.SUPER_ADMIN),
  asyncHandler(updatePaymentStatusHandler),
);

export default router;
