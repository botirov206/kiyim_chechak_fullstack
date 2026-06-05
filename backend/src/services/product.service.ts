import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";

export const productService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { sku: { contains: query.search, mode: "insensitive" as const } },
            { category: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
  },

  async findById(id: string) {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { inventory: { include: { warehouse: true } } },
    });
    if (!product) throw new NotFoundError("Product");
    return product;
  },

  async create(data: {
    sku: string;
    name: string;
    description?: string | null;
    price: number;
    category?: string | null;
    isActive: boolean;
  }) {
    return prisma.product.create({
      data: { ...data, price: new Prisma.Decimal(data.price) },
    });
  },

  async update(
    id: string,
    data: Partial<{
      sku: string;
      name: string;
      description: string | null;
      price: number;
      category: string | null;
      isActive: boolean;
    }>
  ) {
    await this.findById(id);
    const updateData: Prisma.ProductUpdateInput = { ...data };
    if (data.price !== undefined) {
      updateData.price = new Prisma.Decimal(data.price);
    }
    return prisma.product.update({ where: { id }, data: updateData });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.product.delete({ where: { id } });
  },
};
