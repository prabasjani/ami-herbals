import { NextFunction, Request, Response } from "express";

import { verifyAccessToken } from "../common/utils/tokens.js";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../common/errors/http-errors.js";
import { UserRole } from "../modules/user/user.types.js";

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.accessToken;

  if (!token) {
    throw new UnauthorizedError("Unauthorized Entry!");
  }

  const payload = verifyAccessToken(token);

  req.user = {
    id: payload.sub,
    role: payload.role,
  };

  next();
};

export const authorize =
  (...roles: UserRole[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new ForbiddenError());
    }

    if (!roles.includes(req.user.role)) {
      return next(new ForbiddenError("Access Denied!"));
    }

    next();
  };
