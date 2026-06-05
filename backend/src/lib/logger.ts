import winston from "winston";
import { env } from "../config/env";

const { combine, timestamp, printf, colorize, errors } = winston.format;

const logFormat = printf(
  (info: winston.Logform.TransformableInfo & { timestamp?: string; stack?: string }) => {
    const { level, message, timestamp: ts, stack } = info;
    return `${ts} [${level}]: ${stack ?? message}`;
  }
);

export const logger = winston.createLogger({
  level: env.LOG_LEVEL,
  format: combine(
    errors({ stack: true }),
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(colorize(), logFormat),
    }),
  ],
});
