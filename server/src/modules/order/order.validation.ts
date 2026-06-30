import { z } from "zod";

import { OrderStatus, PaymentStatus } from "./order.types.js";

export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;

export const updatePaymentStatusSchema = z.object({
  paymentStatus: z.nativeEnum(PaymentStatus),
});

export type UpdatePaymentStatusInput = z.infer<
  typeof updatePaymentStatusSchema
>;

export const cancelOrderSchema = z.object({
  reason: z.string().trim().min(1).max(500).optional(),
});

export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
