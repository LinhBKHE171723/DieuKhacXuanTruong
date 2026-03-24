import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import routes from "./routes/index.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

const allowedOrigins = env.allowedOrigins.length
  ? env.allowedOrigins
  : [env.clientUrl, env.adminUrl].filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Origin not allowed by CORS"));
    }
  })
);
app.use(helmet());
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Backend is running"
  });
});

app.use("/api", routes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
