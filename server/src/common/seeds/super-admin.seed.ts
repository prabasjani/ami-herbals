import argon2 from "argon2";

import { env } from "../../config/env.js";
import { logger } from "../logger/logger.js";
import { User } from "../../modules/user/user.model.js";
import { UserRole } from "../../modules/user/user.types.js";

export const seedSuperAdmin = async () => {
  const existingSuperAdmin = await User.findOne({
    role: UserRole.SUPER_ADMIN,
  });

  if (existingSuperAdmin) {
    return;
  }

  const hashedPassword = await argon2.hash(env.SUPER_ADMIN_PASSWORD);

  await User.create({
    firstName: "Super",
    lastName: "Admin",
    email: env.SUPER_ADMIN_EMAIL,
    password: hashedPassword,
    role: UserRole.SUPER_ADMIN,
    isEmailVerified: true,
  });

  logger.info("Super admin created");
};
