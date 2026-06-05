import app from "./app";
import { getAllowedOrigins } from "./config/cors";
import { env } from "./config/env";
import { logger } from "./lib/logger";
import { prisma } from "./lib/prisma";

const startServer = async (): Promise<void> => {
  try {
    await prisma.$connect();
    logger.info("Database connected successfully");

    app.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`);
      logger.info(`API available at http://localhost:${env.PORT}/api`);
      logger.info(`CORS allowed origins: ${getAllowedOrigins().join(", ")}`);
    });
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

const gracefulShutdown = async (signal: string): Promise<void> => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  await prisma.$disconnect();
  process.exit(0);
};

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

startServer();
