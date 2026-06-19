import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";
import {
  deleteUser,
  getCurrentUser,
  getUserById,
  getUsers,
  updateUserRole,
} from "./user.service.js";
import { updateProfileSchema, updateRoleSchema } from "./user.validation.js";
import { updateCurrentUser } from "./user.service.js";
import { BadRequestError } from "../../common/errors/http-errors.js";

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await getCurrentUser(req.user!.id);

  res
    .status(200)
    .json(new ApiResponse("User profile fetched successfully", user));
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const payload = updateProfileSchema.parse(req.body);

  const user = await updateCurrentUser(req.user!.id, payload);

  res.status(200).json(new ApiResponse("Profile updated successfully", user));
};

export const getUser = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid user id");
  }

  const user = await getUserById(id);

  res.status(200).json(new ApiResponse("User fetched successfully", user));
};

export const getAllUsers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const users = await getUsers();

  res
    .status(200)
    .json(new ApiResponse("Users List fetched successfully", users));
};

export const updateRole = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const payload = updateRoleSchema.parse(req.body);

  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid user id");
  }

  const user = await updateUserRole(req.user!.id, id, payload);

  res.status(200).json(new ApiResponse("User role updated successfully", user));
};

export const removeUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid user id");
  }

  await deleteUser(req.user!.id, id);

  res.status(200).json(new ApiResponse("User deleted successfully"));
};
