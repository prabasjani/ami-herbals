import mongoose from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";

import { Address } from "../address/address.model.js";

import { Cart } from "../cart/cart.model.js";
import { calculateCart } from "../cart/cart.service.js";

import { generateOrderID } from "../counter/counter.service.js";

import { Order } from "../order/order.model.js";

import { Product } from "../product/product.model.js";

import type { CheckoutInput } from "./checkout.validation.js";
import { IProduct } from "../product/product.interface.js";
import { Coupon } from "../coupon/coupon.model.js";

const validateStock = (cart: any) => {
  for (const item of cart.items) {
    const product = item.product;

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    if (product.isDeleted) {
      throw new BadRequestError(`${product.name} is no longer available`);
    }

    if (item.quantity > product.stock) {
      throw new BadRequestError(
        `Only ${product.stock} quantity available for ${product.name}`,
      );
    }
  }
};

const buildOrderItems = (cart: any) => {
  return cart.items.map((item: any) => {
    const product = item.product as IProduct;

    return {
      product: product._id,

      nameSnapshot: product.name,

      slugSnapshot: product.slug,

      mrpSnapshot: product.mrp,

      priceSnapshot: product.price,

      quantity: item.quantity,

      subtotal: product.price * item.quantity,
    };
  });
};

export const checkout = async (userId: string, payload: CheckoutInput) => {
  if (!payload.shippingAddress) {
    throw new BadRequestError("Shipping address is required");
  }

  if (!payload.paymentMethod) {
    throw new BadRequestError("Payment method is required");
  }

  // const session = await mongoose.startSession();

  try {
    // session.startTransaction();

    const address = await Address.findOne({
      _id: payload.shippingAddress,
      user: userId,
    });
    // .session(session);

    if (!address) {
      throw new NotFoundError("Shipping address not found");
    }

    const cart = await Cart.findOne({
      user: userId,
    }).populate({
      path: "items.product",
    });
    // .session(session);

    if (!cart) {
      throw new NotFoundError("Cart not found");
    }

    if (cart.items.length === 0) {
      throw new BadRequestError("Cart is empty");
    }

    validateStock(cart);

    const summary = await calculateCart(cart);

    const orderID = await generateOrderID();

    let couponId: mongoose.Types.ObjectId | null = null;
    let couponCode: string | null = null;

    if (cart.coupon) {
      const coupon = await Coupon.findById(cart.coupon).select("_id code");
      // .session(session);

      if (coupon) {
        couponId = coupon._id;
        couponCode = coupon.code;
      }
    }

    const order = await Order.create([
      {
        orderID,

        user: address.user,

        items: buildOrderItems(cart),

        shippingAddress: address._id,

        coupon: couponId,

        couponCode,

        couponDiscount: summary.couponDiscount,

        mrpTotal: summary.mrpTotal,

        subtotal: summary.subtotal,

        deliveryCharge: summary.deliveryCharge,

        deliverySavings: summary.deliverySavings,

        totalSavings: summary.totalSavings,

        finalAmount: summary.finalAmount,

        paymentMethod: payload.paymentMethod,
      },
    ]);

    for (const item of cart.items) {
      const product = item.product;

      await Product.findByIdAndUpdate(
        product._id,
        {
          $inc: {
            stock: -item.quantity,
            sold: item.quantity,
          },
        },
        // {
        //   session,
        // },
      );
    }

    cart.items = [];
    cart.coupon = null;

    await cart.save();

    // await session.commitTransaction();

    return order[0];
  } catch (error) {
    // await session.abortTransaction();
    throw error;
  } finally {
    // await session.endSession();
  }
};
