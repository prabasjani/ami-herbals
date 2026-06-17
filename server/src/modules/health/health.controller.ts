import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";
import { getHealthStatus } from "./health.service.js";

export const healthCheck = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const services = await getHealthStatus();

  res.status(200).json(new ApiResponse("Server is healthy", services));
};
