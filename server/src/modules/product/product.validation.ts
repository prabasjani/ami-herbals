import { z } from "zod";

import { ProductStatus } from "./product.types.js";

const productBaseSchema = z.object({
  name: z.string().min(2).max(200),

  description: z.string().min(10).max(5000),

  mrp: z.number().positive(),

  price: z.number().positive(),

  costPrice: z.number().positive(),

  sku: z.string().min(3).max(50),

  stock: z.number().int().nonnegative(),

  category: z.string(),

  images: z.array(z.string().url()).default([]),

  tags: z.array(z.string()).default([]),
});

export const createProductSchema = productBaseSchema
  .refine((data) => data.price <= data.mrp, {
    message: "Selling price cannot exceed MRP",
    path: ["price"],
  })
  .refine((data) => data.costPrice <= data.price, {
    message: "Cost price cannot exceed selling price",
    path: ["costPrice"],
  });

export const updateProductSchema = productBaseSchema
  .partial()
  .refine(
    (data) =>
      data.price === undefined ||
      data.mrp === undefined ||
      data.price <= data.mrp,
    {
      message: "Selling price cannot exceed MRP",
      path: ["price"],
    },
  )
  .refine(
    (data) =>
      data.costPrice === undefined ||
      data.price === undefined ||
      data.costPrice <= data.price,
    {
      message: "Cost price cannot exceed selling price",
      path: ["costPrice"],
    },
  );

export const updateProductStatusSchema = z.object({
  status: z.nativeEnum(ProductStatus),
});

export const updateStockSchema = z.object({
  operation: z.enum(["increase", "decrease"]),

  quantity: z.number().int().positive(),
});

export type CreateProductInput = z.infer<typeof createProductSchema>;

export type UpdateProductInput = z.infer<typeof updateProductSchema>;

export type UpdateProductStatusInput = z.infer<
  typeof updateProductStatusSchema
>;

export type UpdateStockInput = z.infer<typeof updateStockSchema>;
