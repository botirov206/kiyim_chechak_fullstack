import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { UnauthorizedError } from "../utils/errors";
import { Role } from "@prisma/client";

interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}

export const authenticate = async (
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    next(new UnauthorizedError("Access token is required"));
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as JwtPayload;

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true, isActive: true },
    });

    if (!user || !user.isActive) {
      next(new UnauthorizedError("User not found or inactive"));
      return;
    }

    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch {
    next(new UnauthorizedError("Invalid or expired token"));
  }
};
