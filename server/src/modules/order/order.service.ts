import mongoose from "mongoose";

import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../common/errors/http-errors.js";

import { Product } from "../product/product.model.js";

import { Order } from "./order.model.js";
import { OrderStatus, PaymentStatus } from "./order.types.js";

const findOrderById = async (orderId: string) => {
  const order = await Order.findById(orderId)
    .populate("items.product", "name slug images")
    .populate("shippingAddress")
    .populate("user", "name email")
    .populate("coupon", "code");

  if (!order) {
    throw new NotFoundError("Order not found");
  }

  return order;
};

const ensureOrderOwner = (order: any, userId: string) => {
  if (order.user._id.toString() !== userId) {
    throw new ForbiddenError("You are not allowed to access this order");
  }
};

const restoreInventory = async (
  order: any,
  // session: mongoose.ClientSession,
) => {
  for (const item of order.items) {
    await Product.findByIdAndUpdate(
      item.product._id,
      {
        $inc: {
          stock: item.quantity,
          sold: -item.quantity,
        },
      },
      // {
      //   session,
      // },
    );
  }
};

export const getMyOrders = async (userId: string) => {
  return Order.find({
    user: userId,
  })
    .sort({
      createdAt: -1,
    })
    .populate("items.product", "name slug images")
    .populate("coupon", "code");
};

export const getOrderById = async (orderId: string, userId: string) => {
  const order = await findOrderById(orderId);

  ensureOrderOwner(order, userId);

  return order;
};

export const cancelOrder = async (
  orderId: string,
  userId: string,
  reason?: string,
) => {
  // const session = await mongoose.startSession();

  // session.startTransaction();

  try {
    const order = await Order.findById(orderId).populate("items.product");
    // .session(session);

    if (!order) {
      throw new NotFoundError("Order not found");
    }

    if (order.user.toString() !== userId) {
      throw new ForbiddenError("You are not allowed to cancel this order");
    }

    if (order.orderStatus === OrderStatus.CANCELLED) {
      throw new BadRequestError("Order is already cancelled");
    }

    if (order.orderStatus === OrderStatus.DELIVERED) {
      throw new BadRequestError("Delivered order cannot be cancelled");
    }

    if (order.orderStatus === OrderStatus.SHIPPED) {
      throw new BadRequestError("Shipped order cannot be cancelled");
    }

    // await restoreInventory(order, session);
    await restoreInventory(order);

    order.orderStatus = OrderStatus.CANCELLED;

    if (order.paymentStatus === PaymentStatus.PAID) {
      order.paymentStatus = PaymentStatus.REFUNDED;
    }

    if ("cancelReason" in order) {
      (order as any).cancelReason = reason ?? null;
    }

    if ("cancelledAt" in order) {
      (order as any).cancelledAt = new Date();
    }

    await order.save();
    // await order.save({ session });

    // await session.commitTransaction();

    return order;
  } catch (error) {
    // await session.abortTransaction();

    throw error;
  } finally {
    // await session.endSession();
  }
};

const validateStatusTransition = (
  currentStatus: OrderStatus,
  nextStatus: OrderStatus,
) => {
  const allowedTransitions: Record<OrderStatus, OrderStatus[]> = {
    [OrderStatus.PENDING]: [OrderStatus.CONFIRMED, OrderStatus.CANCELLED],

    [OrderStatus.CONFIRMED]: [OrderStatus.PROCESSING, OrderStatus.CANCELLED],

    [OrderStatus.PROCESSING]: [OrderStatus.PACKED, OrderStatus.CANCELLED],

    [OrderStatus.PACKED]: [OrderStatus.SHIPPED, OrderStatus.CANCELLED],

    [OrderStatus.SHIPPED]: [OrderStatus.OUT_FOR_DELIVERY],

    [OrderStatus.OUT_FOR_DELIVERY]: [OrderStatus.DELIVERED],

    [OrderStatus.DELIVERED]: [],

    [OrderStatus.CANCELLED]: [],
  };

  if (!allowedTransitions[currentStatus].includes(nextStatus)) {
    throw new BadRequestError(
      `Cannot change order status from ${currentStatus} to ${nextStatus}`,
    );
  }
};

export const getOrders = async (filters?: {
  status?: OrderStatus;
  paymentStatus?: PaymentStatus;
}) => {
  const query: Record<string, unknown> = {};

  if (filters?.status) {
    query.orderStatus = filters.status;
  }

  if (filters?.paymentStatus) {
    query.paymentStatus = filters.paymentStatus;
  }

  return Order.find(query)
    .sort({
      createdAt: -1,
    })
    .populate("user", "name email")
    .populate("shippingAddress")
    .populate("coupon", "code");
};

export const updateOrderStatus = async (
  orderId: string,
  status: OrderStatus,
) => {
  const order = await findOrderById(orderId);

  validateStatusTransition(order.orderStatus, status);

  order.orderStatus = status;

  await order.save();

  return order;
};

export const updatePaymentStatus = async (
  orderId: string,
  paymentStatus: PaymentStatus,
) => {
  const order = await findOrderById(orderId);

  if (order.orderStatus === OrderStatus.CANCELLED) {
    throw new BadRequestError(
      "Cannot update payment status of a cancelled order",
    );
  }

  if (order.paymentStatus === paymentStatus) {
    throw new BadRequestError("Payment status is already updated");
  }

  order.paymentStatus = paymentStatus;

  await order.save();

  return order;
};
