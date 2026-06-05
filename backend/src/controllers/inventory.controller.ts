import { Request, Response } from "express";
import { inventoryService } from "../services/inventory.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const inventoryController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await inventoryService.findAll(query);
    sendPaginated(res, result.inventory, result.total, result.page, result.limit);
  }),

  getLowStock: asyncHandler(async (_req: Request, res: Response) => {
    const items = await inventoryService.getLowStock();
    sendSuccess(res, items, "Low stock items retrieved");
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const item = await inventoryService.findById(getRouteParam(req, "id"));
    sendSuccess(res, item);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof inventoryService.create>[0]>(req);
    const item = await inventoryService.create(body);
    sendSuccess(res, item, "Inventory record created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof inventoryService.update>[1]>(req);
    const item = await inventoryService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, item, "Inventory record updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await inventoryService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Inventory record deleted");
  }),
};
