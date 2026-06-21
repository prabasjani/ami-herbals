import slugify from "slugify";

import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";
import { Category } from "./category.model.js";
import {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "./category.validation.js";

export const createCategory = async (
  userId: string,
  payload: CreateCategoryInput,
) => {
  const existingCategory = await Category.findOne({
    name: {
      $regex: new RegExp(`^${payload.name}$`, "i"),
    },
  });

  if (existingCategory) {
    throw new BadRequestError("Category already exists");
  }

  return Category.create({
    ...payload,
    createdBy: userId,
  });
};

export const getCategories = async () => {
  return Category.find({
    isActive: true,
  }).sort({
    createdAt: -1,
  });
};

export const getCategoryBySlug = async (slug: string) => {
  const category = await Category.findOne({
    slug,
    isActive: true,
  });

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  return category;
};

export const updateCategory = async (
  categoryId: string,
  payload: UpdateCategoryInput,
) => {
  if (payload.name) {
    const existingCategory = await Category.findOne({
      _id: { $ne: categoryId },
      name: {
        $regex: new RegExp(`^${payload.name}$`, "i"),
      },
    });

    if (existingCategory) {
      throw new BadRequestError("Category already exists");
    }
  }

  const category = await Category.findById(categoryId);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  Object.assign(category, payload);

  await category.save();

  return category;
};

export const deleteCategory = async (categoryId: string) => {
  const category = await Category.findById(categoryId);

  if (!category) {
    throw new NotFoundError("Category not found");
  }

  category.isActive = false;

  await category.save();
};
