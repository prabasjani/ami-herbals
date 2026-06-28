import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";

import {
  applyCoupon,
  createCoupon,
  getCouponById,
  getCoupons,
  hardDeleteCoupon,
  removeCoupon,
  softDeleteCoupon,
  updateCoupon,
} from "./coupon.service.js";

import {
  applyCouponSchema,
  createCouponSchema,
  updateCouponSchema,
} from "./coupon.validation.js";
import { BadRequestError } from "../../common/errors/http-errors.js";

export const create = async (req: Request, res: Response) => {
  const payload = createCouponSchema.parse(req.body);

  const coupon = await createCoupon(payload);

  res.status(201).json(new ApiResponse("Coupon created successfully", coupon));
};

export const findAll = async (req: Request, res: Response) => {
  const coupons = await getCoupons();

  res
    .status(200)
    .json(new ApiResponse("Coupons fetched successfully", coupons));
};

export const findById = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid coupon id");
  }
  const coupon = await getCouponById(id);

  res.status(200).json(new ApiResponse("Coupon fetched successfully", coupon));
};

export const update = async (req: Request, res: Response) => {
  const payload = updateCouponSchema.parse(req.body);

  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid coupon id");
  }

  const coupon = await updateCoupon(id, payload);

  res.status(200).json(new ApiResponse("Coupon updated successfully", coupon));
};

export const softDelete = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid coupon id");
  }

  const coupon = await softDeleteCoupon(id);

  res.status(200).json(new ApiResponse("Coupon archived successfully", coupon));
};

export const hardDelete = async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid coupon id");
  }

  await hardDeleteCoupon(id);

  res.status(200).json(new ApiResponse("Coupon permanently deleted", null));
};

export const apply = async (req: Request, res: Response) => {
  const payload = applyCouponSchema.parse(req.body);

  const result = await applyCoupon(req.user!.id, payload.code);

  res.status(200).json(new ApiResponse("Coupon applied successfully", result));
};

export const remove = async (req: Request, res: Response) => {
  const result = await removeCoupon(req.user!.id);

  res.status(200).json(new ApiResponse("Coupon removed successfully", result));
};
