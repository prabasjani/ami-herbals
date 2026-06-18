import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { login, logout, refreshToken, register } from "./auth.controller.js";

const router = Router();

router.post("/register", asyncHandler(register));

router.post("/login", asyncHandler(login));

router.post("/refresh-token", asyncHandler(refreshToken));

router.post("/logout", asyncHandler(logout));

export default router;
