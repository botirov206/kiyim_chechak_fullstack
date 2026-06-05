import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";

export const inventoryService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { product: { name: { contains: query.search, mode: "insensitive" as const } } },
            { warehouse: { name: { contains: query.search, mode: "insensitive" as const } } },
          ],
        }
      : {};

    const [inventory, total] = await Promise.all([
      prisma.inventory.findMany({
        where,
        skip,
        take: limit,
        include: { product: true, warehouse: true },
        orderBy: { updatedAt: "desc" },
      }),
      prisma.inventory.count({ where }),
    ]);

    return { inventory, total, page, limit };
  },

  async findById(id: string) {
    const item = await prisma.inventory.findUnique({
      where: { id },
      include: { product: true, warehouse: true },
    });
    if (!item) throw new NotFoundError("Inventory");
    return item;
  },

  async create(data: {
    productId: string;
    warehouseId: string;
    quantity: number;
    minStock: number;
  }) {
    return prisma.inventory.create({
      data,
      include: { product: true, warehouse: true },
    });
  },

  async update(id: string, data: Partial<{ quantity: number; minStock: number }>) {
    await this.findById(id);
    return prisma.inventory.update({
      where: { id },
      data,
      include: { product: true, warehouse: true },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.inventory.delete({ where: { id } });
  },

  async getLowStock() {
    return prisma.inventory.findMany({
      where: { quantity: { lte: prisma.inventory.fields.minStock } },
      include: { product: true, warehouse: true },
    });
  },
};
