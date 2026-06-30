import { z } from "zod";

import { DeliveryStatus } from "./delivery.types.js";

export const createOrUpdateDeliverySchema = z.object({
  standardCharge: z.number().nonnegative(),

  freeDeliveryThreshold: z.number().nonnegative(),

  expressCharge: z.number().nonnegative().default(0),

  expressThreshold: z.number().nonnegative().default(0),

  isExpressEnabled: z.boolean().default(false),

  status: z.nativeEnum(DeliveryStatus).default(DeliveryStatus.ACTIVE),
});

export type CreateOrUpdateDeliveryInput = z.infer<
  typeof createOrUpdateDeliverySchema
>;
