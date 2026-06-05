import { Request, Response } from "express";
import { productService } from "../services/product.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const productController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await productService.findAll(query);
    sendPaginated(res, result.products, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const product = await productService.findById(getRouteParam(req, "id"));
    sendSuccess(res, product);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof productService.create>[0]>(req);
    const product = await productService.create(body);
    sendSuccess(res, product, "Product created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof productService.update>[1]>(req);
    const product = await productService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, product, "Product updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await productService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "Product deleted");
  }),
};
