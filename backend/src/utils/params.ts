import { Request } from "express";

export const getRouteParam = (req: Request, key: string): string => {
  const validatedParams = req.validated?.params as Record<string, string> | undefined;
  if (validatedParams?.[key]) {
    return validatedParams[key];
  }

  const value = req.params[key];
  return Array.isArray(value) ? value[0] : value;
};
