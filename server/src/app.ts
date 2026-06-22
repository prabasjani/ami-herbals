import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";

import healthRoutes from "./modules/health/health.route.js";
import authRoutes from "./modules/auth/auth.route.js";
import userRoutes from "./modules/user/user.route.js";
import addressRoutes from "./modules/address/address.route.js";
import categoryRoutes from "./modules/category/category.route.js";
import productRoutes from "./modules/product/product.route.js";
import cartRoutes from "./modules/cart/cart.route.js";

const app = express();

app.use(helmet());

app.use(compression());

app.use(express.json());

app.use(cookieParser());

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  }),
);

app.use("/api/v1/health", healthRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/addresses", addressRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/cart", cartRoutes);

app.use(errorMiddleware);

export default app;
