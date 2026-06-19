import { User } from "./user.model.js";
import {
  ForbiddenError,
  NotFoundError,
} from "../../common/errors/http-errors.js";
import { UpdateProfileInput, UpdateRoleInput } from "./user.validation.js";
import { UserRole } from "./user.types.js";

export const getCurrentUser = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const updateCurrentUser = async (
  userId: string,
  payload: UpdateProfileInput,
) => {
  const user = await User.findByIdAndUpdate(userId, payload, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const getUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }

  return user;
};

export const getUsers = async () => {
  return User.find().sort({ createdAt: -1 });
};

export const updateUserRole = async (
  currentUserId: string,
  targetUserId: string,
  payload: UpdateRoleInput,
) => {
  if (currentUserId === targetUserId) {
    throw new ForbiddenError("Cannot change your own role");
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  if (targetUser.role === UserRole.SUPER_ADMIN) {
    throw new ForbiddenError("Cannot modify super admin");
  }

  targetUser.role = payload.role;

  await targetUser.save();

  return targetUser;
};

export const deleteUser = async (
  currentUserId: string,
  targetUserId: string,
) => {
  if (currentUserId === targetUserId) {
    throw new ForbiddenError("Cannot delete your own account");
  }

  const currentUser = await User.findById(currentUserId);

  if (!currentUser) {
    throw new NotFoundError("Current user not found");
  }

  const targetUser = await User.findById(targetUserId);

  if (!targetUser) {
    throw new NotFoundError("User not found");
  }

  // Nobody can delete SUPER_ADMIN
  if (targetUser.role === UserRole.SUPER_ADMIN) {
    throw new ForbiddenError("Cannot delete super admin");
  }

  // ADMIN can only delete CUSTOMER
  if (
    currentUser.role === UserRole.ADMIN &&
    targetUser.role !== UserRole.CUSTOMER
  ) {
    throw new ForbiddenError("Admin can only delete customers");
  }

  // SUPER_ADMIN can delete ADMIN and CUSTOMER
  if (
    currentUser.role === UserRole.SUPER_ADMIN &&
    [UserRole.ADMIN, UserRole.CUSTOMER].includes(targetUser.role)
  ) {
    await targetUser.deleteOne();
    return;
  }

  // ADMIN can delete CUSTOMER
  if (
    currentUser.role === UserRole.ADMIN &&
    targetUser.role === UserRole.CUSTOMER
  ) {
    await targetUser.deleteOne();
    return;
  }

  throw new ForbiddenError("You are not authorized to delete this user");
};
