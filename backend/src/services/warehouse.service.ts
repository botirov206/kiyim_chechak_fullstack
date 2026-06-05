import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";

export const warehouseService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { code: { contains: query.search, mode: "insensitive" as const } },
            { location: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [warehouses, total] = await Promise.all([
      prisma.warehouse.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.warehouse.count({ where }),
    ]);

    return { warehouses, total, page, limit };
  },

  async findById(id: string) {
    const warehouse = await prisma.warehouse.findUnique({
      where: { id },
      include: { inventory: { include: { product: true } } },
    });
    if (!warehouse) throw new NotFoundError("Warehouse");
    return warehouse;
  },

  async create(data: {
    name: string;
    code: string;
    location?: string | null;
    capacity?: number | null;
    isActive: boolean;
  }) {
    return prisma.warehouse.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      code: string;
      location: string | null;
      capacity: number | null;
      isActive: boolean;
    }>
  ) {
    await this.findById(id);
    return prisma.warehouse.update({ where: { id }, data });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.warehouse.delete({ where: { id } });
  },
};
