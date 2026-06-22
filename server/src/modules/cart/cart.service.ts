import { Types } from "mongoose";

import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";

import { Product } from "../product/product.model.js";
import { ProductStatus } from "../product/product.types.js";

import { Cart } from "./cart.model.js";

import type { AddItemInput, UpdateQuantityInput } from "./cart.validation.js";

// const populateCart = () =>
//   Cart.findOne().populate("items.product", "name slug images mrp price stock");

const calculateCart = (cart: any) => {
  let mrpTotal = 0;
  let subtotal = 0;
  let totalItems = 0;

  for (const item of cart.items) {
    const product = item.product;

    mrpTotal += product.mrp * item.quantity;

    subtotal += product.price * item.quantity;

    totalItems += item.quantity;
  }

  const productSavings = mrpTotal - subtotal;

  const couponDiscount = 0;

  const deliveryCharge = 0;

  const deliverySavings = 0;

  const totalSavings = productSavings + couponDiscount + deliverySavings;

  const finalAmount = subtotal - couponDiscount + deliveryCharge;

  return {
    items: cart.items,

    mrpTotal,

    subtotal,

    productSavings,

    couponDiscount,

    deliveryCharge,

    deliverySavings,

    totalSavings,

    finalAmount,

    totalItems,
  };
};

export const addItem = async (userId: string, input: AddItemInput) => {
  const product = await Product.findOne({
    _id: input.productId,
    isDeleted: false,
    status: ProductStatus.ACTIVE,
  });

  if (!product || product.stock <= 0) {
    throw new BadRequestError("Product unavailable");
  }

  let cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    cart = await Cart.create({
      user: userId,

      items: [],
    });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === input.productId,
  );

  if (existingItem) {
    const newQuantity = existingItem.quantity + input.quantity;

    if (newQuantity > product.stock) {
      throw new BadRequestError("Insufficient stock");
    }

    existingItem.quantity = newQuantity;
  } else {
    if (input.quantity > product.stock) {
      throw new BadRequestError("Insufficient stock");
    }

    cart.items.push({
      product: new Types.ObjectId(input.productId),

      quantity: input.quantity,

      priceSnapshot: product.price,
    });
  }

  await cart.save();

  const populatedCart = await Cart.findById(cart._id).populate(
    "items.product",
    "name slug images mrp price stock",
  );

  return calculateCart(populatedCart);
};

export const getCart = async (userId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  }).populate("items.product", "name slug images mrp price stock");

  if (!cart) {
    return {
      items: [],

      mrpTotal: 0,

      subtotal: 0,

      productSavings: 0,

      couponDiscount: 0,

      deliveryCharge: 0,

      deliverySavings: 0,

      totalSavings: 0,

      finalAmount: 0,

      totalItems: 0,
    };
  }

  return calculateCart(cart);
};

export const updateQuantity = async (
  userId: string,
  productId: string,
  input: UpdateQuantityInput,
) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  const item = cart.items.find((item) => item.product.toString() === productId);

  if (!item) {
    throw new NotFoundError("Item not found in cart");
  }

  if (input.quantity === 0) {
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId,
    );

    await cart.save();

    return getCart(userId);
  }

  const product = await Product.findById(productId);

  if (!product) {
    throw new NotFoundError("Product not found");
  }

  if (input.quantity > product.stock) {
    throw new BadRequestError("Insufficient stock");
  }

  item.quantity = input.quantity;

  await cart.save();

  return getCart(userId);
};

export const removeItem = async (userId: string, productId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId,
  );

  await cart.save();

  return getCart(userId);
};

export const clearCart = async (userId: string) => {
  const cart = await Cart.findOne({
    user: userId,
  });

  if (!cart) {
    throw new NotFoundError("Cart not found");
  }

  cart.items = [];

  cart.coupon = null;

  await cart.save();

  return getCart(userId);
};
