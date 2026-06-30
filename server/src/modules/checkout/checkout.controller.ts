import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";

import { checkout } from "./checkout.service.js";
import { checkoutSchema } from "./checkout.validation.js";

export const createOrder = async (req: Request, res: Response) => {
  const payload = checkoutSchema.parse(req.body ?? {});

  const order = await checkout(req.user!.id, payload);

  res.status(201).json(new ApiResponse("Order placed successfully", order));
};
