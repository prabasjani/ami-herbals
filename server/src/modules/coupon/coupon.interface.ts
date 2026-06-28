import { Document, Types } from "mongoose";

import { CouponStatus, CouponType } from "./coupon.types.js";

export interface ICoupon extends Document {
  code: string;

  name: string;

  description?: string;

  type: CouponType;

  discountValue: number;

  minimumOrderAmount: number;

  maximumDiscount?: number;

  usageLimit?: number;

  usedCount: number;

  startDate: Date;

  expiryDate: Date;

  isStackable: boolean;

  isInternal: boolean;

  overrideSafetyRules: boolean;

  overrideReason?: string;

  status: CouponStatus;

  isDeleted: boolean;

  createdAt: Date;

  updatedAt: Date;
}
