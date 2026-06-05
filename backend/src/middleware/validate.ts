import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../utils/errors";

type RequestSource = "body" | "query" | "params";

export const validate =
  (schema: ZodSchema, source: RequestSource = "body") =>
  (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "root";
        if (!errors[key]) errors[key] = [];
        errors[key].push(issue.message);
      }
      next(new ValidationError(errors));
      return;
    }

    req.validated = { ...req.validated, [source]: result.data };
    next();
  };
