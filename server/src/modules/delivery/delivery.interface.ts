import { Document } from "mongoose";

import { DeliveryStatus } from "./delivery.types.js";

export interface IDelivery extends Document {
  standardCharge: number;

  freeDeliveryThreshold: number;

  expressCharge: number;

  expressThreshold: number;

  isExpressEnabled: boolean;

  status: DeliveryStatus;

  createdAt: Date;

  updatedAt: Date;
}
