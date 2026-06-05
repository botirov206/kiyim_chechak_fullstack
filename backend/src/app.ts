import express from "express";
import helmet from "helmet";
import { corsMiddleware, corsOptions } from "./config/cors";
import cors from "cors";
import routes from "./routes";
import { requestLogger } from "./middleware/requestLogger";
import { notFoundHandler, errorHandler } from "./middleware/errorHandler";

const app = express();

app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
  })
);

app.use(corsMiddleware);
app.options(/.*/, cors(corsOptions));

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(requestLogger);

app.use("/api", routes);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
