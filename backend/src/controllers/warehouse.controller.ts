import { Request, Response } from "express";
import { warehouseService } from "../services/warehouse.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const warehouseController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await warehouseService.findAll(query);
    sendPaginated(res, result.warehouses, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const warehouse = await warehouseService.findById(getRouteParam(req, "id"));
    sendSuccess(res, warehouse);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof warehouseService.create>[0]>(req);
    const warehouse = await warehouseService.create(body);
    sendSuccess(res, warehouse, "Warehouse created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof warehouseService.update>[1]>(req);
    const warehouse = await warehouseService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, warehouse, "Warehouse updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await warehouseService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Warehouse deleted");
  }),
};
