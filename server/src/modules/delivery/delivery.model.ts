import { model, Schema } from "mongoose";

import { IDelivery } from "./delivery.interface.js";
import { DeliveryStatus } from "./delivery.types.js";

const deliverySchema = new Schema<IDelivery>(
  {
    standardCharge: {
      type: Number,
      required: true,
      min: 0,
    },

    freeDeliveryThreshold: {
      type: Number,
      required: true,
      min: 0,
    },

    expressCharge: {
      type: Number,
      default: 0,
      min: 0,
    },

    expressThreshold: {
      type: Number,
      default: 0,
      min: 0,
    },

    isExpressEnabled: {
      type: Boolean,
      default: false,
    },

    status: {
      type: String,
      enum: Object.values(DeliveryStatus),
      default: DeliveryStatus.ACTIVE,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Delivery = model<IDelivery>("Delivery", deliverySchema);
