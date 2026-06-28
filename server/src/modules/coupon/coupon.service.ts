import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";

import { Cart } from "../cart/cart.model.js";

import {
  calculateCouponDiscount,
  validateCouponAvailability,
  validateCouponRules,
  validateCouponSafetyOverride,
} from "./coupon.helper.js";

import { Coupon } from "./coupon.model.js";
import { CouponStatus } from "./coupon.types.js";

import type {
  CreateCouponInput,
  UpdateCouponInput,
} from "./coupon.validation.js";

export const createCoupon = async (payload: CreateCouponInput) => {
  const existingCoupon = await Coupon.findOne({
    code: payload.code,
    isDeleted: false,
  });

  if (existingCoupon) {
    throw new BadRequestError("Coupon code already exists");
  }

  validateCouponRules(payload);

  validateCouponSafetyOverride(payload);

  return Coupon.create(payload);
};

export const getCoupons = async () => {
  return Coupon.find({
    isDeleted: false,
  }).sort({
    createdAt: -1,
  });
};

export const getCouponById = async (id: string) => {
  const coupon = await Coupon.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  return coupon;
};

export const updateCoupon = async (id: string, payload: UpdateCouponInput) => {
  const coupon = await Coupon.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  if (payload.code && payload.code !== coupon.code) {
    const existingCoupon = await Coupon.findOne({
      code: payload.code,
      isDeleted: false,
      _id: {
        $ne: id,
      },
    });

    if (existingCoupon) {
      throw new BadRequestError("Coupon code already exists");
    }
  }

  validateCouponRules(payload);
  validateCouponSafetyOverride(payload);

  Object.assign(coupon, payload);

  await coupon.save();

  return coupon;
};

export const softDeleteCoupon = async (id: string) => {
  const coupon = await Coupon.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  coupon.status = CouponStatus.ARCHIVED;
  coupon.isDeleted = true;

  await coupon.save();

  return coupon;
};

export const hardDeleteCoupon = async (id: string) => {
  const coupon = await Coupon.findById(id);

  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  await coupon.deleteOne();

  return null;
};

export const applyCoupon = async (userId: string, code: string) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  if (cart.items.length === 0) {
    throw new BadRequestError("Cart is empty");
  }

  if (cart.coupon) {
    throw new BadRequestError("Coupon already applied");
  }

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isDeleted: false,
  });

  if (!coupon) {
    throw new NotFoundError("Coupon not found");
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.priceSnapshot * item.quantity,
    0,
  );

  validateCouponAvailability(coupon, subtotal);

  const calculation = calculateCouponDiscount(coupon, subtotal);

  cart.coupon = coupon._id;

  coupon.usedCount += 1;

  await Promise.all([cart.save(), coupon.save()]);

  return {
    cart,

    couponCode: coupon.code,

    subtotal,

    discount: calculation.totalDiscount,

    finalAmount: calculation.finalAmount,

    freeShipping: calculation.shippingDiscount > 0,

    savedAmount: calculation.totalDiscount,
  };
};

export const removeCoupon = async (userId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  if (!cart.coupon) {
    throw new BadRequestError("No coupon applied to cart");
  }

  const coupon = await Coupon.findById(cart.coupon);

  if (coupon && coupon.usedCount > 0) {
    coupon.usedCount -= 1;

    await coupon.save();
  }

  cart.coupon = null;

  await cart.save();

  const subtotal = cart.items.reduce(
    (total, item) => total + item.priceSnapshot * item.quantity,
    0,
  );

  return {
    cart,

    subtotal,

    couponCode: null,

    discount: 0,

    finalAmount: subtotal,

    freeShipping: false,

    savedAmount: 0,
  };
};
