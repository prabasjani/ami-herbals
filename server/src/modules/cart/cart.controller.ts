import type { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";

import {
  addItem,
  getCart,
  updateQuantity,
  removeItem,
  clearCart,
} from "./cart.service.js";

export const addItemToCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await addItem(req.user!.id, req.body);

  res.status(201).json(new ApiResponse("Item added to cart", result));
};

export const getMyCart = async (req: Request, res: Response): Promise<void> => {
  const result = await getCart(req.user!.id);

  res.status(200).json(new ApiResponse("Cart fetched successfully", result));
};

export const updateCartItemQuantity = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = req.params.productId;

  if (!productId || Array.isArray(productId)) {
    throw new Error("Invalid product id");
  }

  const result = await updateQuantity(req.user!.id, productId, req.body);

  res.status(200).json(new ApiResponse("Cart updated successfully", result));
};

export const removeCartItem = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productId = req.params.productId;

  if (!productId || Array.isArray(productId)) {
    throw new Error("Invalid product id");
  }

  const result = await removeItem(req.user!.id, productId);

  res.status(200).json(new ApiResponse("Item removed from cart", result));
};

export const clearMyCart = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const result = await clearCart(req.user!.id);

  res.status(200).json(new ApiResponse("Cart cleared successfully", result));
};
