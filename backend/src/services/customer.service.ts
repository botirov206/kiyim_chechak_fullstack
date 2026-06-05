import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";

export const customerService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: "insensitive" as const } },
            { email: { contains: query.search, mode: "insensitive" as const } },
            { company: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [customers, total] = await Promise.all([
      prisma.customer.findMany({ where, skip, take: limit, orderBy: { createdAt: "desc" } }),
      prisma.customer.count({ where }),
    ]);

    return { customers, total, page, limit };
  },

  async findById(id: string) {
    const customer = await prisma.customer.findUnique({
      where: { id },
      include: { orders: { take: 5, orderBy: { createdAt: "desc" } } },
    });
    if (!customer) throw new NotFoundError("Customer");
    return customer;
  },

  async create(data: {
    name: string;
    email?: string | null;
    phone?: string | null;
    address?: string | null;
    company?: string | null;
    isActive: boolean;
  }) {
    return prisma.customer.create({ data });
  },

  async update(
    id: string,
    data: Partial<{
      name: string;
      email: string | null;
      phone: string | null;
      address: string | null;
      company: string | null;
      isActive: boolean;
    }>
  ) {
    await this.findById(id);
    return prisma.customer.update({ where: { id }, data });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.customer.delete({ where: { id } });
  },
};
