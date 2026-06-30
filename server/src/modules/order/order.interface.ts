import { Document, Types } from "mongoose";

import { OrderStatus, PaymentMethod, PaymentStatus } from "./order.types.js";
import { IProduct } from "../product/product.interface.js";
import { ICoupon } from "../coupon/coupon.interface.js";

export interface IOrderItem {
  product: Types.ObjectId | IProduct;

  nameSnapshot: string;

  slugSnapshot: string;

  mrpSnapshot: number;

  priceSnapshot: number;

  quantity: number;

  subtotal: number;
}

export interface IOrder extends Document {
  orderID: string;

  user: Types.ObjectId;

  items: IOrderItem[];

  shippingAddress: Types.ObjectId;

  coupon?: Types.ObjectId | ICoupon | null;

  couponCode?: string | null;

  couponDiscount: number;

  mrpTotal: number;

  subtotal: number;

  deliveryCharge: number;

  deliverySavings: number;

  totalSavings: number;

  finalAmount: number;

  paymentMethod: PaymentMethod;

  paymentStatus: PaymentStatus;

  orderStatus: OrderStatus;

  placedAt: Date;

  deliveredAt?: Date;

  createdAt: Date;

  updatedAt: Date;
}
