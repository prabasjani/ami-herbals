import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";

import { Category } from "../category/category.model.js";
import { Product } from "./product.model.js";
import { ProductStatus } from "./product.types.js";

import type {
  CreateProductInput,
  UpdateProductInput,
  UpdateProductStatusInput,
  UpdateStockInput,
} from "./product.validation.js";

export const createProduct = async (
  userId: string,
  payload: CreateProductInput,
) => {
  const existingName = await Product.findOne({
    name: {
      $regex: new RegExp(`^${payload.name}$`, "i"),
    },
  });

  if (existingName) {
    throw new BadRequestError("Product name already exists");
  }

  const existingSku = await Product.findOne({
    sku: payload.sku.toUpperCase(),
  });

  if (existingSku) {
    throw new BadRequestError("SKU already exists");
  }

  const category = await Category.findOne({
    _id: payload.category,
    isActive: true,
  });

  if (!category) {
    throw new BadRequestError("Invalid category");
  }

  return Product.create({
    ...payload,
    sku: payload.sku.toUpperCase(),
    createdBy: userId,
  });
};

export const getProducts = async () => {
  return Product.find({
    status: ProductStatus.ACTIVE,
    isDeleted: false,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

export const getProductBySlug = async (slug: string) => {
  const product = await Product.findOne({
    slug,
    status: ProductStatus.ACTIVE,
    isDeleted: false,
  }).populate("category", "name slug");

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  return product;
};

export const getFeaturedProducts = async () => {
  return Product.find({
    status: ProductStatus.ACTIVE,
    isDeleted: false,
    isFeatured: true,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

export const searchProducts = async (query: string) => {
  return Product.find(
    {
      $text: {
        $search: query,
      },

      status: ProductStatus.ACTIVE,

      isDeleted: false,
    },
    {
      score: {
        $meta: "textScore",
      },
    },
  )
    .sort({
      score: {
        $meta: "textScore",
      },
    })
    .populate("category", "name slug");
};

export const getProductsByCategory = async (slug: string) => {
  const category = await Category.findOne({
    slug,
    isActive: true,
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return Product.find({
    category: category._id,
    status: ProductStatus.ACTIVE,
    isDeleted: false,
  })
    .populate("category", "name slug")
    .sort({
      createdAt: -1,
    });
};

export const updateProduct = async (
  productId: string,
  payload: UpdateProductInput,
) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError("Product not found");
  }

  if (payload.name) {
    const existingProduct = await Product.findOne({
      _id: { $ne: productId },

      name: {
        $regex: new RegExp(`^${payload.name}$`, "i"),
      },
    });

    if (existingProduct) {
      throw new BadRequestError("Product name already exists");
    }
  }

  if (payload.category) {
    const category = await Category.findOne({
      _id: payload.category,
      isActive: true,
    });

    if (!category) {
      throw new BadRequestError("Invalid category");
    }
  }

  const { sku, ...updateData } = payload;

  Object.assign(product, updateData);

  await product.save();

  return product;
};

export const updateProductStatus = async (
  productId: string,
  payload: UpdateProductStatusInput,
) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError("Product not found");
  }

  product.status = payload.status;

  await product.save();

  return product;
};

export const toggleFeatured = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError("Product not found");
  }

  product.isFeatured = !product.isFeatured;

  await product.save();

  return product;
};

export const updateStock = async (
  productId: string,
  payload: UpdateStockInput,
) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError("Product not found");
  }

  if (payload.operation === "increase") {
    product.stock += payload.quantity;

    if (product.status === ProductStatus.OUT_OF_STOCK && product.stock > 0) {
      product.status = ProductStatus.ACTIVE;
    }
  }

  if (payload.operation === "decrease") {
    if (product.stock < payload.quantity) {
      throw new BadRequestError("Insufficient stock");
    }

    product.stock -= payload.quantity;

    if (product.stock === 0) {
      product.status = ProductStatus.OUT_OF_STOCK;
    }
  }

  await product.save();

  return product;
};

export const deleteProduct = async (productId: string) => {
  const product = await Product.findById(productId);

  if (!product || product.isDeleted) {
    throw new NotFoundError("Product not found");
  }

  product.isDeleted = true;

  product.status = ProductStatus.ARCHIVED;

  await product.save();
};
