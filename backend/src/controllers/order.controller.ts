import { Request, Response } from "express";
import { orderService } from "../services/order.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const orderController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await orderService.findAll(query);
    sendPaginated(res, result.orders, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const order = await orderService.findById(getRouteParam(req, "id"));
    sendSuccess(res, order);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof orderService.create>[0]>(req);
    const order = await orderService.create(body);
    sendSuccess(res, order, "Order created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof orderService.update>[1]>(req);
    const order = await orderService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, order, "Order updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await orderService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Order deleted");
  }),
};
