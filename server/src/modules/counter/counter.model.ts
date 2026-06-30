import { model, Schema } from "mongoose";

import { ICounter } from "./counter.interface.js";

const counterSchema = new Schema<ICounter>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    sequence: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Counter = model<ICounter>("Counter", counterSchema);
