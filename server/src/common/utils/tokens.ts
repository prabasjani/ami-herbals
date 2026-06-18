import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";

export const generateAccessToken = (userId: string, role: string) => {
  return jwt.sign(
    {
      sub: userId,
      role,
    },
    env.JWT_ACCESS_SECRET,
    {
      expiresIn: "15m",
    },
  );
};

export const generateRefreshToken = (userId: string) => {
  return jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET!, {
    expiresIn: "15m",
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, env.JWT_ACCESS_SECRET) as {
    sub: string;
    role: string;
  };
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, env.JWT_REFRESH_SECRET) as {
    sub: string;
  };
};
