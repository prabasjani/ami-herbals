import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middleware/error.middleware.js";
import healthRoutes from "./modules/health/health.route.js";

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

app.use(errorMiddleware);

export default app;
