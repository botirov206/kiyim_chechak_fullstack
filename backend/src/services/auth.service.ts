import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { prisma } from "../lib/prisma";
import { ConflictError, UnauthorizedError } from "../utils/errors";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 12;

const sanitizeUser = (user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) => {
  const { password: _, ...safe } = user as typeof user & { password?: string };
  return safe;
};

export const authService = {
  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
  }) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictError("Email already registered");

    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role ?? "EMPLOYEE",
      },
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    return { user: sanitizeUser(user), token };
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.isActive) {
      throw new UnauthorizedError("Invalid email or password");
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedError("Invalid email or password");

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions["expiresIn"] }
    );

    return { user: sanitizeUser(user), token };
  },

  async getProfile(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new UnauthorizedError("User not found");
    return sanitizeUser(user);
  },
};
