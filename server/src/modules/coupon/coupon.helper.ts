import { BadRequestError } from "../../common/errors/http-errors.js";

import type { ICoupon } from "./coupon.interface.js";

import { CouponStatus, CouponType } from "./coupon.types.js";

import type {
  CreateCouponInput,
  UpdateCouponInput,
} from "./coupon.validation.js";

export const validateCouponRules = (
  data: CreateCouponInput | UpdateCouponInput,
): void => {
  if (data.startDate && data.expiryDate && data.expiryDate <= data.startDate) {
    throw new BadRequestError("Expiry date must be after start date");
  }

  if (
    data.type === CouponType.PERCENTAGE &&
    data.discountValue !== undefined &&
    data.discountValue > 100
  ) {
    throw new BadRequestError("Percentage discount cannot exceed 100");
  }

  if (data.overrideSafetyRules && !data.overrideReason?.trim()) {
    throw new BadRequestError("Override reason is required");
  }
};

export const validateCouponSafetyOverride = (
  data: CreateCouponInput | UpdateCouponInput,
) => {
  const minimumOrderAmount = data.minimumOrderAmount ?? 0;
  const discountValue = data.discountValue ?? 0;

  const requiresOverride =
    (data.type === CouponType.FLAT && discountValue > minimumOrderAmount) ||
    (data.type === CouponType.PERCENTAGE && discountValue >= 100);

  if (requiresOverride && !data.overrideSafetyRules) {
    throw new BadRequestError(
      "This coupon may result in a loss. Please enable override safety rules and provide a reason.",
    );
  }
};

export const validateCouponAvailability = (
  coupon: ICoupon,
  subtotal: number,
): void => {
  const now = new Date();

  if (coupon.status !== CouponStatus.ACTIVE) {
    throw new BadRequestError("Coupon is not active");
  }

  if (coupon.startDate > now) {
    throw new BadRequestError("Coupon is not yet available");
  }

  if (coupon.expiryDate < now) {
    throw new BadRequestError("Coupon has expired");
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    throw new BadRequestError("Coupon usage limit exceeded");
  }

  if (subtotal < coupon.minimumOrderAmount) {
    throw new BadRequestError("Minimum order amount not reached");
  }
};

export const calculateCouponDiscount = (coupon: ICoupon, subtotal: number) => {
  let discount = 0;

  let shippingDiscount = 0;

  switch (coupon.type) {
    case CouponType.PERCENTAGE:
      discount = (subtotal * coupon.discountValue) / 100;

      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }

      break;

    case CouponType.FLAT:
      discount = Math.min(coupon.discountValue, subtotal);
      break;

    case CouponType.FREE_SHIPPING:
      shippingDiscount = 0;
      break;
  }

  return {
    subtotal,

    productDiscount: discount,

    shippingDiscount,

    totalDiscount: discount + shippingDiscount,

    finalAmount: subtotal - discount - shippingDiscount,
  };
};
