import { z } from "zod";

import { PaymentMethod } from "../order/order.types.js";

export const checkoutSchema = z.object({
  shippingAddress: z.string().trim().optional(),

  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;
