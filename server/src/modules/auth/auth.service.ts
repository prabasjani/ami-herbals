import argon2 from "argon2";
import { User } from "../user/user.model.js";
import { RegisterInput } from "./auth.validation.js";
import {
  ConflictError,
  UnauthorizedError,
} from "../../common/errors/http-errors.js";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../../common/utils/tokens.js";

export const registerUser = async (payload: RegisterInput) => {
  const existingUser = await User.findOne({
    email: payload.email,
  });

  if (existingUser) {
    throw new ConflictError("Email already exists");
  }

  const hashedPassword = await argon2.hash(payload.password);

  const user = await User.create({
    ...payload,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email }).select("+password +refreshToken");

  if (!user) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const isPasswordValid = await argon2.verify(user.password, password);

  if (!isPasswordValid) {
    throw new UnauthorizedError("Invalid credentials");
  }

  const accessToken = generateAccessToken(user.id, user.role);

  const refreshToken = generateRefreshToken(user.id);

  user.refreshToken = refreshToken;
  user.lastLogin = new Date();

  await user.save();

  return {
    user,
    accessToken,
    refreshToken,
  };
};

export const refreshUserToken = async (token: string) => {
  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.sub).select("+refreshToken");

  if (!user || user.refreshToken !== token) {
    throw new UnauthorizedError("Invalid refresh token");
  }

  const accessToken = generateAccessToken(user.id, user.role);

  return {
    accessToken,
  };
};

export const logoutUser = async (token: string) => {
  const payload = verifyRefreshToken(token);

  const user = await User.findById(payload.sub).select("+refreshToken");

  if (!user) {
    return;
  }

  user.refreshToken = undefined;

  await user.save();
};
