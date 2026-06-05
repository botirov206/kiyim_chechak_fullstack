import { Request } from "express";

type ValidatedSource = "body" | "query" | "params";

export const getValidated = <T>(req: Request, source: ValidatedSource): T => {
  const value = req.validated?.[source];
  if (value === undefined) {
    return req[source] as T;
  }
  return value as T;
};

export const getValidatedBody = <T>(req: Request): T => getValidated<T>(req, "body");

export const getValidatedQuery = <T>(req: Request): T => getValidated<T>(req, "query");

export const getValidatedParams = <T>(req: Request): T => getValidated<T>(req, "params");
