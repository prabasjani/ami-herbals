import { z } from "zod";
import { UserRole } from "./user.types.js";

export const updateProfileSchema = z.object({
  firstName: z.string().trim().min(2).max(50).optional(),
  lastName: z.string().trim().min(1).max(50).optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const updateRoleSchema = z.object({
  role: z.enum([UserRole.CUSTOMER, UserRole.ADMIN]),
});

export type UpdateRoleInput = z.infer<typeof updateRoleSchema>;
