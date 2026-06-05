import { Request, Response } from "express";
import { reportService } from "../services/report.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const reportController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await reportService.findAll(query);
    sendPaginated(res, result.reports, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const report = await reportService.findById(getRouteParam(req, "id"));
    sendSuccess(res, report);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof reportService.create>[0]>(req);
    const report = await reportService.create({
      ...body,
      createdById: req.user!.id,
    });
    sendSuccess(res, report, "Report created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof reportService.update>[1]>(req);
    const report = await reportService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, report, "Report updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await reportService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Report deleted");
  }),

  generateSales: asyncHandler(async (req: Request, res: Response) => {
    const data = await reportService.generateSalesReport();
    const report = await reportService.create({
      title: "Sales Report",
      type: "SALES",
      description: "Auto-generated sales report",
      data,
      createdById: req.user!.id,
    });
    sendSuccess(res, report, "Sales report generated", 201);
  }),

  generateInventory: asyncHandler(async (req: Request, res: Response) => {
    const data = await reportService.generateInventoryReport();
    const report = await reportService.create({
      title: "Inventory Report",
      type: "INVENTORY",
      description: "Auto-generated inventory report",
      data,
      createdById: req.user!.id,
    });
    sendSuccess(res, report, "Inventory report generated", 201);
  }),
};
