import { Request, Response, NextFunction } from "express";
import { Role } from "@prisma/client";
import { ForbiddenError } from "../utils/errors";

const ROLE_HIERARCHY: Record<Role, number> = {
  ADMIN: 3,
  MANAGER: 2,
  EMPLOYEE: 1,
};

export const authorize = (...allowedRoles: Role[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
};

export const authorizeMinRole = (minRole: Role) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new ForbiddenError("Authentication required"));
      return;
    }

    if (ROLE_HIERARCHY[req.user.role] < ROLE_HIERARCHY[minRole]) {
      next(new ForbiddenError("Insufficient permissions"));
      return;
    }

    next();
  };
};
