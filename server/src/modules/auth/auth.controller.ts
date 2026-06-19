import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import {
  loginUser,
  logoutUser,
  refreshUserToken,
  registerUser,
} from "./auth.service.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { UnauthorizedError } from "../../common/errors/http-errors.js";

export const register = async (req: Request, res: Response): Promise<void> => {
  const payload = registerSchema.parse(req.body);

  const user = await registerUser(payload);

  res.status(201).json(
    new ApiResponse("User registered successfully", {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    }),
  );
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const payload = loginSchema.parse(req.body);

  const result = await loginUser(payload.email, payload.password);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false, // true in production with HTTPS
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  res.cookie("refreshToken", result.refreshToken, {
    httpOnly: true,
    secure: false,
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json(
    new ApiResponse("Login successful", {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        firstName: result.user.firstName,
        lastName: result.user.lastName,
        email: result.user.email,
        role: result.user.role,
      },
    }),
  );
};

export const refreshToken = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const token = req.cookies.refreshToken;

  if (!token) {
    throw new UnauthorizedError("Refresh token missing");
  }

  const result = await refreshUserToken(token);

  res.cookie("accessToken", result.accessToken, {
    httpOnly: true,
    secure: false, // true in production
    sameSite: "strict",
    maxAge: 15 * 60 * 1000,
  });

  res.status(200).json(new ApiResponse("Token refreshed"));
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  const token = req.cookies.refreshToken;

  if (token) {
    await logoutUser(token);
  }

  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");

  res.status(200).json(new ApiResponse("Logged out successfully"));
};
