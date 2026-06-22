import { model, Schema } from "mongoose";

import type { ICart } from "./cart.interface.js";

const cartItemSchema = new Schema(
  {
    product: {
      type: Schema.Types.ObjectId,

      ref: "Product",

      required: true,
    },

    quantity: {
      type: Number,

      required: true,

      min: 1,
    },

    priceSnapshot: {
      type: Number,

      required: true,

      min: 0,
    },
  },

  {
    _id: false,
  },
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,

      ref: "User",

      required: true,

      unique: true,
    },

    items: {
      type: [cartItemSchema],

      default: [],
    },

    coupon: {
      type: Schema.Types.ObjectId,

      ref: "Coupon",

      default: null,
    },
  },

  {
    timestamps: true,
  },
);

export const Cart = model<ICart>("Cart", cartSchema);
