import {
  BadRequestError,
  NotFoundError,
} from "../../common/errors/http-errors.js";
import { Address } from "./address.model.js";
import {
  CreateAddressInput,
  UpdateAddressInput,
} from "./address.validation.js";

export const createAddress = async (
  userId: string,
  payload: CreateAddressInput,
) => {
  const count = await Address.countDocuments({
    user: userId,
  });

  if (count >= 3) {
    throw new BadRequestError("Maximum 3 addresses allowed");
  }

  const isFirstAddress = count === 0;

  const address = await Address.create({
    ...payload,
    user: userId,
    isDefault: isFirstAddress,
  });

  return address;
};

export const getAddresses = async (userId: string) => {
  return Address.find({
    user: userId,
  }).sort({
    isDefault: -1,
    createdAt: -1,
  });
};

export const getAddressById = async (userId: string, addressId: string) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  return address;
};

export const updateAddress = async (
  userId: string,
  addressId: string,
  payload: UpdateAddressInput,
) => {
  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      user: userId,
    },
    payload,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  return address;
};

export const deleteAddress = async (userId: string, addressId: string) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  const wasDefault = address.isDefault;

  await address.deleteOne();

  if (wasDefault) {
    const nextAddress = await Address.findOne({
      user: userId,
    }).sort({
      createdAt: -1,
    });

    if (nextAddress) {
      nextAddress.isDefault = true;

      await nextAddress.save();
    }
  }
};

export const setDefaultAddress = async (userId: string, addressId: string) => {
  const address = await Address.findOne({
    _id: addressId,
    user: userId,
  });

  if (!address) {
    throw new NotFoundError("Address not found");
  }

  await Address.updateMany(
    {
      user: userId,
    },
    {
      isDefault: false,
    },
  );

  address.isDefault = true;

  await address.save();

  return address;
};
