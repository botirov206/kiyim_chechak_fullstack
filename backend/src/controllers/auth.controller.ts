import { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { sendSuccess } from "../utils/response";
import { asyncHandler } from "../utils/asyncHandler";
import { getValidatedBody } from "../utils/validated";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const body = getValidatedBody<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role?: "ADMIN" | "MANAGER" | "EMPLOYEE";
    }>(req);
    const result = await authService.register(body);
    sendSuccess(res, result, "User registered successfully", 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = getValidatedBody<{ email: string; password: string }>(req);
    const result = await authService.login(email, password);
    sendSuccess(res, result, "Login successful");
  }),

  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const profile = await authService.getProfile(req.user!.id);
    sendSuccess(res, profile, "Profile retrieved");
  }),
};
