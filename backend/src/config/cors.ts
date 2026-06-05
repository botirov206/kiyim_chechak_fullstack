import cors, { CorsOptions } from "cors";
import { env } from "./env";

const LOCAL_DEV_ORIGINS = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
];

export const getAllowedOrigins = (): string[] => {
  const configured =
    env.CORS_ORIGIN === "*"
      ? []
      : env.CORS_ORIGIN.split(",")
          .map((origin) => origin.trim())
          .filter(Boolean);

  if (env.NODE_ENV === "production") {
    return configured;
  }

  return [...new Set([...LOCAL_DEV_ORIGINS, ...configured])];
};

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = getAllowedOrigins();

    // Non-browser clients (Postman, curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (allowedOrigins.includes(origin)) {
      callback(null, origin);
      return;
    }

    callback(new Error(`Origin ${origin} is not allowed by CORS`));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
  maxAge: 86400,
};

export const corsMiddleware = cors(corsOptions);
