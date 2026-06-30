import { Counter } from "./counter.model.js";
import { env } from "../../config/env.js";

export const generateOrderID = async () => {
  const counter = await Counter.findOneAndUpdate(
    {
      name: "order",
    },
    {
      $inc: {
        sequence: 1,
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  const sequence = String(counter.sequence).padStart(6, "0");

  return `${env.ORDER_PREFIX}${year}${month}${day}${sequence}`;
};
