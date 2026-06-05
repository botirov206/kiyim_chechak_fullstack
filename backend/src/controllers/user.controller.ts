import { Request, Response } from "express";
import { userService } from "../services/user.service";
import { sendSuccess, sendPaginated } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getRouteParam } from "../utils/params";
import { getValidatedBody, getValidatedQuery } from "../utils/validated";
import { PaginationQuery } from "../utils/pagination";

export const userController = {
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const query = getValidatedQuery<PaginationQuery>(req);
    const result = await userService.findAll(query);
    sendPaginated(res, result.users, result.total, result.page, result.limit);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(getRouteParam(req, "id"));
    sendSuccess(res, user);
  }),

  create: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof userService.create>[0]>(req);
    const user = await userService.create(body);
    sendSuccess(res, user, "User created", 201);
  }),

  update: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<Parameters<typeof userService.update>[1]>(req);
    const user = await userService.update(getRouteParam(req, "id"), body);
    sendSuccess(res, user, "User updated");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    await userService.delete(getRouteParam(req, "id"));
    sendSuccess(res, null, "User deleted");
  }),
};
