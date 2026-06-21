import { Document, Types } from "mongoose";

import { ProductStatus } from "./product.types.js";

export interface IProduct extends Document {
  name: string;
  slug: string;

  description: string;

  mrp: number;
  price: number;
  costPrice: number;

  sku: string;

  stock: number;

  category: Types.ObjectId;

  images: string[];

  tags: string[];

  averageRating: number;
  totalReviews: number;

  status: ProductStatus;

  isFeatured: boolean;

  isDeleted: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
