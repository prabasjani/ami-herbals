import { Router } from "express";
import { asyncHandler } from "../../common/utils/async-handler.js";
import { authenticate } from "../../middleware/auth.middleware.js";

import {
  create,
  getAll,
  getOne,
  remove,
  setDefault,
  update,
} from "./address.controller.js";

const router = Router();

router.use(authenticate);

router.post("/", asyncHandler(create));

router.get("/", asyncHandler(getAll));

router.get("/:id", asyncHandler(getOne));

router.patch("/:id", asyncHandler(update));

router.delete("/:id", asyncHandler(remove));

router.patch("/:id/default", asyncHandler(setDefault));

export default router;
