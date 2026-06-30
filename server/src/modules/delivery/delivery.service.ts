import { NotFoundError } from "../../common/errors/http-errors.js";

import { Delivery } from "./delivery.model.js";
import { DeliveryStatus } from "./delivery.types.js";
import { CreateOrUpdateDeliveryInput } from "./delivery.validation.js";

export const createOrUpdateDelivery = async (
  payload: CreateOrUpdateDeliveryInput,
) => {
  const count = await Delivery.countDocuments();

  if (count > 1) {
    throw new Error("Multiple delivery configurations found.");
  }

  let delivery = await Delivery.findOne();

  if (!delivery) {
    delivery = await Delivery.create(payload);

    return delivery;
  }

  Object.assign(delivery, payload);

  await delivery.save();

  return delivery;
};

export const getDeliveryConfig = async () => {
  const delivery = await Delivery.findOne({
    status: DeliveryStatus.ACTIVE,
  });

  if (!delivery) {
    throw new NotFoundError("Delivery configuration not found");
  }

  return delivery;
};

export const calculateDelivery = async (subtotal: number) => {
  const delivery = await Delivery.findOne({
    status: DeliveryStatus.ACTIVE,
  });

  if (!delivery) {
    return {
      deliveryCharge: 0,
      deliverySavings: 0,
    };
  }

  if (subtotal >= delivery.freeDeliveryThreshold) {
    return {
      deliveryCharge: 0,
      deliverySavings: delivery.standardCharge,
    };
  }

  return {
    deliveryCharge: delivery.standardCharge,
    deliverySavings: 0,
  };
};
