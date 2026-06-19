import { z } from "zod";
import { AddressLabel } from "./address.types.js";

export const createAddressSchema = z.object({
  label: z.nativeEnum(AddressLabel).optional(),

  fullName: z.string().min(2).max(100),

  phone: z.string().min(10).max(15),

  addressLine1: z.string().min(5).max(255),

  addressLine2: z.string().max(255).optional(),

  city: z.string().min(2).max(100),

  state: z.string().min(2).max(100),

  postalCode: z.string().min(3).max(20),

  country: z.string().min(2).max(100).default("India"),

  landmark: z.string().max(255).optional(),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;

export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
