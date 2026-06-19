import { Document, Types } from "mongoose";
import { AddressLabel } from "./address.types.js";

export interface IAddress extends Document {
  user: Types.ObjectId;

  label: AddressLabel;

  fullName: string;
  phone: string;

  addressLine1: string;
  addressLine2?: string;

  city: string;
  state: string;
  postalCode: string;
  country: string;

  landmark?: string;

  isDefault: boolean;

  createdAt: Date;
  updatedAt: Date;
}
