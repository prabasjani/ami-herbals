import { model, Schema } from "mongoose";

import { IOrder } from "./order.interface.js";

import { OrderStatus, PaymentMethod, PaymentStatus } from "./order.types.js";

const orderSchema = new Schema<IOrder>(
  {
    orderID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    items: [
      {
        product: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },

        nameSnapshot: {
          type: String,
          required: true,
          trim: true,
        },

        slugSnapshot: {
          type: String,
          required: true,
          trim: true,
        },

        mrpSnapshot: {
          type: Number,
          required: true,
          min: 0,
        },

        priceSnapshot: {
          type: Number,
          required: true,
          min: 0,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        subtotal: {
          type: Number,
          required: true,
          min: 0,
        },
      },
    ],

    shippingAddress: {
      type: Schema.Types.ObjectId,
      ref: "Address",
      required: true,
    },

    coupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
      default: null,
    },

    couponCode: {
      type: String,
      default: null,
      trim: true,
    },

    couponDiscount: {
      type: Number,
      default: 0,
      min: 0,
    },

    mrpTotal: {
      type: Number,
      required: true,
      min: 0,
    },

    subtotal: {
      type: Number,
      required: true,
      min: 0,
    },

    deliveryCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    deliverySavings: {
      type: Number,
      default: 0,
      min: 0,
    },

    totalSavings: {
      type: Number,
      default: 0,
      min: 0,
    },

    finalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.COD,
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PaymentStatus),
      default: PaymentStatus.PENDING,
    },

    orderStatus: {
      type: String,
      enum: Object.values(OrderStatus),
      default: OrderStatus.PENDING,
    },

    placedAt: {
      type: Date,
      default: Date.now,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

orderSchema.index({
  user: 1,
  createdAt: -1,
});

export const Order = model<IOrder>("Order", orderSchema);
