import { Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  slug: string;
  description?: string;
  image?: string;

  isActive: boolean;

  createdBy: Types.ObjectId;

  createdAt: Date;
  updatedAt: Date;
}
