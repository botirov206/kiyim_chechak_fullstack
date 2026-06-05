import { Request, Response } from "express";
import { customerService } from "../services/customer.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const customerController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await customerService.findAll(query);
    sendPaginated(res, result.customers, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const customer = await customerService.findById(getRouteParam(req, "id"));
    sendSuccess(res, customer);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof customerService.create>[0]>(req);
    const customer = await customerService.create(body);
    sendSuccess(res, customer, "Customer created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof customerService.update>[1]>(req);
    const customer = await customerService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, customer, "Customer updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await customerService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Customer deleted");
  }),
};
