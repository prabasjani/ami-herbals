import { Request, Response } from "express";

import { ApiResponse } from "../../common/utils/api-response.js";
import { BadRequestError } from "../../common/errors/http-errors.js";

import {
  createProduct,
  deleteProduct,
  getFeaturedProducts,
  getProductBySlug,
  getProducts,
  getProductsByCategory,
  searchProducts,
  toggleFeatured,
  updateProduct,
  updateProductStatus,
  updateStock,
} from "./product.service.js";

import {
  createProductSchema,
  updateProductSchema,
  updateProductStatusSchema,
  updateStockSchema,
} from "./product.validation.js";

export const create = async (req: Request, res: Response): Promise<void> => {
  const payload = createProductSchema.parse(req.body);

  const product = await createProduct(req.user!.id, payload);

  res
    .status(201)
    .json(new ApiResponse("Product created successfully", product));
};

export const getAll = async (req: Request, res: Response): Promise<void> => {
  const products = await getProducts();

  res
    .status(200)
    .json(new ApiResponse("Products fetched successfully", products));
};

export const getOne = async (req: Request, res: Response): Promise<void> => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new BadRequestError("Invalid product slug");
  }

  const product = await getProductBySlug(slug);

  res
    .status(200)
    .json(new ApiResponse("Product fetched successfully", product));
};

export const getFeatured = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const products = await getFeaturedProducts();

  res
    .status(200)
    .json(new ApiResponse("Featured products fetched successfully", products));
};

export const search = async (req: Request, res: Response): Promise<void> => {
  const query = req.query.q;

  if (typeof query !== "string") {
    throw new BadRequestError("Search query is required");
  }

  const products = await searchProducts(query);

  res
    .status(200)
    .json(new ApiResponse("Products fetched successfully", products));
};

export const getByCategory = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const slug = req.params.slug;

  if (!slug || Array.isArray(slug)) {
    throw new BadRequestError("Invalid category slug");
  }

  const products = await getProductsByCategory(slug);

  res
    .status(200)
    .json(new ApiResponse("Products fetched successfully", products));
};

export const update = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid product id");
  }

  const payload = updateProductSchema.parse(req.body);

  const product = await updateProduct(id, payload);

  res
    .status(200)
    .json(new ApiResponse("Product updated successfully", product));
};

export const updateStatus = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid product id");
  }

  const payload = updateProductStatusSchema.parse(req.body);

  const product = await updateProductStatus(id, payload);

  res
    .status(200)
    .json(new ApiResponse("Product status updated successfully", product));
};

export const feature = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid product id");
  }

  const product = await toggleFeatured(id);

  res
    .status(200)
    .json(
      new ApiResponse("Product feature status updated successfully", product),
    );
};

export const stock = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid product id");
  }

  const payload = updateStockSchema.parse(req.body);

  const product = await updateStock(id, payload);

  res
    .status(200)
    .json(new ApiResponse("Product stock updated successfully", product));
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const id = req.params.id;

  if (!id || Array.isArray(id)) {
    throw new BadRequestError("Invalid product id");
  }

  await deleteProduct(id);

  res.status(200).json(new ApiResponse("Product deleted successfully"));
};
