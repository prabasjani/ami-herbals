import { Document } from "mongoose";
import { UserRole } from "./user.types.js";

export interface IUser extends Document {
  firstName: string;
  lastName: string;

  email: string;
  password: string;

  role: UserRole;

  isEmailVerified: boolean;

  refreshToken?: string;

  lastLogin?: Date;

  createdAt: Date;
  updatedAt: Date;
}
