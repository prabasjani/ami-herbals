import mongoose from "mongoose";
import { redisClient } from "../../config/redis.js";

export const getHealthStatus = async () => {
  const mongoStatus =
    mongoose.connection.readyState === 1 ? "connected" : "disconnected";

  const redisStatus = redisClient.isReady ? "connected" : "disconnected";

  return {
    mongodb: mongoStatus,
    redis: redisStatus,
  };
};
