import type { Request, Response } from "express";

import { BadRequestError } from "../../common/errors/http-errors.js";
import { ApiResponse } from "../../common/utils/api-response.js";

import {
  cancelOrder,
  getMyOrders,
  getOrderById,
  getOrders,
  updateOrderStatus,
  updatePaymentStatus,
} from "./order.service.js";

import {
  cancelOrderSchema,
  updateOrderStatusSchema,
  updatePaymentStatusSchema,
} from "./order.validation.js";

export const getMyOrdersHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await getMyOrders(req.user!.id);

  res.status(200).json(new ApiResponse("Orders fetched successfully", orders));
};

export const getOrderByIdHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid order id");
  }

  const order = await getOrderById(id, req.user!.id);

  res.status(200).json(new ApiResponse("Order fetched successfully", order));
};

export const cancelOrderHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid order id");
  }

  const payload = cancelOrderSchema.parse(req.body ?? {});

  const order = await cancelOrder(id, req.user!.id, payload.reason);

  res.status(200).json(new ApiResponse("Order cancelled successfully", order));
};

export const getOrdersHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const orders = await getOrders({
    status: req.query.status as any,
    paymentStatus: req.query.paymentStatus as any,
  });

  res.status(200).json(new ApiResponse("Orders fetched successfully", orders));
};

export const updateOrderStatusHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid order id");
  }

  const payload = updateOrderStatusSchema.parse(req.body);

  const order = await updateOrderStatus(id, payload.status);

  res
    .status(200)
    .json(new ApiResponse("Order status updated successfully", order));
};

export const updatePaymentStatusHandler = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid order id");
  }

  const payload = updatePaymentStatusSchema.parse(req.body);

  const order = await updatePaymentStatus(id, payload.paymentStatus);

  res
    .status(200)
    .json(new ApiResponse("Payment status updated successfully", order));
};
