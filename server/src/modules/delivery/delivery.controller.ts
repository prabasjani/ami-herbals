import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";

import {
  createOrUpdateDelivery,
  getDeliveryConfig,
} from "./delivery.service.js";

import { createOrUpdateDeliverySchema } from "./delivery.validation.js";

export const createOrUpdate = async (req: Request, res: Response) => {
  const payload = createOrUpdateDeliverySchema.parse(req.body);

  const delivery = await createOrUpdateDelivery(payload);

  res
    .status(200)
    .json(
      new ApiResponse("Delivery configuration saved successfully", delivery),
    );
};

export const findConfig = async (req: Request, res: Response) => {
  const delivery = await getDeliveryConfig();

  res
    .status(200)
    .json(
      new ApiResponse("Delivery configuration fetched successfully", delivery),
    );
};
