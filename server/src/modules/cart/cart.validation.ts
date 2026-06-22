import { z } from "zod";

export const addItemSchema = z.object({
  productId: z.string(),
  quantity: z.number().int().positive(),
});

export const updateQuantitySchema = z.object({
  quantity: z.number().int().nonnegative(),
});

export type AddItemInput = z.infer<typeof addItemSchema>;

export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;
