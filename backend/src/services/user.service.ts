import bcrypt from "bcrypt";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";
import { Role } from "@prisma/client";

const SALT_ROUNDS = 12;

const userSelect = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  role: true,
  isActive: true,
  createdAt: true,
  updatedAt: true,
};

export const userService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { email: { contains: query.search, mode: "insensitive" as const } },
            { firstName: { contains: query.search, mode: "insensitive" as const } },
            { lastName: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({ where, select: userSelect, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.user.count({ where }),
    ]);

    return { users, total, page, limit };
  },

  async findById(id: string) {
    const user = await prisma.user.findUnique({ where: { id }, select: userSelect });
    if (!user) throw new NotFoundError("User");
    return user;
  },

  async create(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role: Role;
    isActive: boolean;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, SALT_ROUNDS);
    return prisma.user.create({
      data: { ...data, password: hashedPassword },
      select: userSelect,
    });
  },

  async update(
    id: string,
    data: Partial<{
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: Role;
      isActive: boolean;
    }>
  ) {
    await this.findById(id);
    const updateData = { ...data };
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }
    return prisma.user.update({ where: { id }, data: updateData, select: userSelect });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.user.delete({ where: { id } });
  },
};
