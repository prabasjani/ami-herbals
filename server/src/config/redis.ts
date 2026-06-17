import { createClient } from "redis";
import { env } from "./env.js";

export const redisClient = createClient({
  url: env.REDIS_URL,
});

redisClient.on("error", (error) => {
  console.error("Redis Error:", error);
});

export const connectRedis = async () => {
  try {
    await redisClient.connect();

    console.log("Redis Connected");
  } catch (error) {
    console.warn("Redis unavailable. Continuing without Redis...");
  }
};

// Redis running on Docker cmd
// 1. docker pull redis:7-alpine
// 2. docker run -d --name ami-herbals-redis -p 6379:6379 redis:7-alpine
// 3. To Check docker ps
