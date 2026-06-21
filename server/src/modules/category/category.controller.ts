import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";
import { BadRequestError } from "../../common/errors/http-errors.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryBySlug,
  updateCategory,
} from "./category.service.js";

import {
  createCategorySchema,
  updateCategorySchema,
} from "./category.validation.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const payload = createCategorySchema.parse(req.body);

  const category = await createCategory(req.user!.id, payload);

  res
    .status(201)
    .json(new ApiResponse("Category created successfully", category));
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const categories = await getCategories();

  res
    .status(200)
    .json(new ApiResponse("Categories fetched successfully", categories));
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new BadRequestError("Invalid slug");
  }

  const category = await getCategoryBySlug(slug);

  res
    .status(200)
    .json(new ApiResponse("Category fetched successfully", category));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid category id");
  }

  const payload = updateCategorySchema.parse(req.body);

  const category = await updateCategory(id, payload);

  res
    .status(200)
    .json(new ApiResponse("Category updated successfully", category));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid category id");
  }

  await deleteCategory(id);

  res.status(200).json(new ApiResponse("Category deleted successfully"));
};
