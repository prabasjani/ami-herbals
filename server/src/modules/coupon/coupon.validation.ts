import { z } from "zod";

import { CouponStatus, CouponType } from "./coupon.types.js";

const couponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(3)
    .max(50)
    .transform((value) => value.toUpperCase()),

  name: z.string().trim().min(3).max(100),

  description: z.string().trim().optional(),

  type: z.nativeEnum(CouponType),

  discountValue: z.number().nonnegative(),

  minimumOrderAmount: z.number().nonnegative(),

  maximumDiscount: z.number().nonnegative().optional(),

  usageLimit: z.number().int().positive().optional(),

  startDate: z.coerce.date(),

  expiryDate: z.coerce.date(),

  isStackable: z.boolean().default(false),

  isInternal: z.boolean().default(false),

  overrideSafetyRules: z.boolean().default(false),

  overrideReason: z.string().trim().optional(),

  status: z.nativeEnum(CouponStatus).default(CouponStatus.ACTIVE),
});

export const createCouponSchema = couponSchema;

export const updateCouponSchema = couponSchema.partial();

export const applyCouponSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .transform((value) => value.toUpperCase()),
});

export type CreateCouponInput = z.infer<typeof createCouponSchema>;

export type UpdateCouponInput = z.infer<typeof updateCouponSchema>;

export type ApplyCouponInput = z.infer<typeof applyCouponSchema>;
