import "dotenv/config";

import app from "./app.js";

import { env } from "./config/env.js";

import { connectDatabase } from "./config/database.js";

import { connectRedis } from "./config/redis.js";

const bootstrap = async () => {
  await connectDatabase();

  await connectRedis();

  app.listen(env.PORT, () => {
    console.log(`Server running on port ${env.PORT}`);
  });
};

bootstrap();
