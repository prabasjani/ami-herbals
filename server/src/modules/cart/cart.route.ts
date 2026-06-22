import { Router } from "express";

import { authenticate } from "../../middleware/auth.middleware.js";

import { validate } from "../../middleware/validate.middleware.js";

import { addItemSchema, updateQuantitySchema } from "./cart.validation.js";

import {
  addItemToCart,
  getMyCart,
  updateCartItemQuantity,
  removeCartItem,
  clearMyCart,
} from "./cart.controller.js";

const router = Router();

router.use(authenticate);

router.post("/items", validate(addItemSchema), addItemToCart);

router.get("/", getMyCart);

router.patch(
  "/items/:productId",
  validate(updateQuantitySchema),
  updateCartItemQuantity,
);

router.delete("/items/:productId", removeCartItem);

router.delete("/", clearMyCart);

export default router;
