import { Schema, model } from "mongoose";

import { ICoupon } from "./coupon.interface.js";

import { CouponStatus, CouponType } from "./coupon.types.js";

const couponSchema = new Schema<ICoupon>(
  {
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    type: {
      type: String,
      enum: Object.values(CouponType),
      required: true,
      index: true,
    },

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    minimumOrderAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    maximumDiscount: {
      type: Number,
      min: 0,
    },

    usageLimit: {
      type: Number,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    startDate: {
      type: Date,
      required: true,
    },

    expiryDate: {
      type: Date,
      required: true,
      index: true,
    },

    isStackable: {
      type: Boolean,
      default: false,
    },

    isInternal: {
      type: Boolean,
      default: false,
    },

    overrideSafetyRules: {
      type: Boolean,
      default: false,
    },

    overrideReason: {
      type: String,
      trim: true,
    },

    status: {
      type: String,
      enum: Object.values(CouponStatus),
      default: CouponStatus.ACTIVE,
      index: true,
    },

    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Coupon = model<ICoupon>("Coupon", couponSchema);
