import { Request, Response } from "express";
import { ApiResponse } from "../../common/utils/api-response.js";
import {
  createAddress,
  deleteAddress,
  getAddressById,
  getAddresses,
  setDefaultAddress,
  updateAddress,
} from "./address.service.js";
import {
  createAddressSchema,
  updateAddressSchema,
} from "./address.validation.js";
import { BadRequestError } from "../../common/errors/http-errors.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const payload = createAddressSchema.parse(req.body);

  const address = await createAddress(req.user!.id, payload);

  res
    .status(201)
    .json(new ApiResponse("Address created successfully", address));
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const addresses = await getAddresses(req.user!.id);

  res
    .status(200)
    .json(new ApiResponse("Addresses fetched successfully", addresses));
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid address id");
  }

  const address = await getAddressById(req.user!.id, id);

  res
    .status(200)
    .json(new ApiResponse("Address fetched successfully", address));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid address id");
  }

  const payload = updateAddressSchema.parse(req.body);

  const address = await updateAddress(req.user!.id, id, payload);

  res
    .status(200)
    .json(new ApiResponse("Address updated successfully", address));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid address id");
  }

  await deleteAddress(req.user!.id, id);

  res.status(200).json(new ApiResponse("Address deleted successfully"));
};

export const setDefault = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid address id");
  }

  const address = await setDefaultAddress(req.user!.id, id);

  res
    .status(200)
    .json(new ApiResponse("Default address updated successfully", address));
};
