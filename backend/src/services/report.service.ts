import { Prisma, ReportType } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";

export const reportService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { title: { contains: query.search, mode: "insensitive" as const } },
            { description: { contains: query.search, mode: "insensitive" as const } },
          ],
        }
      : {};

    const [reports, total] = await Promise.all([
      prisma.report.findMany({
        where,
        skip,
        take: limit,
        include: { createdBy: { select: { id: true, email: true, firstName: true, lastName: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.report.count({ where }),
    ]);

    return { reports, total, page, limit };
  },

  async findById(id: string) {
    const report = await prisma.report.findUnique({
      where: { id },
      include: { createdBy: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
    if (!report) throw new NotFoundError("Report");
    return report;
  },

  async create(data: {
    title: string;
    type: ReportType;
    description?: string | null;
    data?: Record<string, unknown> | null;
    createdById: string;
  }) {
    return prisma.report.create({
      data: {
        title: data.title,
        type: data.type,
        description: data.description,
        data: data.data as Prisma.InputJsonValue | undefined,
        createdById: data.createdById,
      },
      include: { createdBy: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  },

  async update(
    id: string,
    data: Partial<{
      title: string;
      type: ReportType;
      description: string | null;
      data: Record<string, unknown> | null;
    }>
  ) {
    await this.findById(id);
    const updateData: Prisma.ReportUpdateInput = {
      title: data.title,
      type: data.type,
      description: data.description,
    };
    if (data.data !== undefined) {
      updateData.data = data.data as Prisma.InputJsonValue;
    }
    return prisma.report.update({
      where: { id },
      data: updateData,
      include: { createdBy: { select: { id: true, email: true, firstName: true, lastName: true } } },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.report.delete({ where: { id } });
  },

  async generateSalesReport() {
    const [orders, totalRevenue, orderCount] = await Promise.all([
      prisma.order.findMany({
        where: { status: { not: "CANCELLED" } },
        include: { customer: true, items: true },
        orderBy: { createdAt: "desc" },
        take: 100,
      }),
      prisma.order.aggregate({
        where: { status: { not: "CANCELLED" } },
        _sum: { totalAmount: true },
      }),
      prisma.order.count({ where: { status: { not: "CANCELLED" } } }),
    ]);

    return {
      totalRevenue: totalRevenue._sum.totalAmount,
      orderCount,
      recentOrders: orders,
      generatedAt: new Date().toISOString(),
    };
  },

  async generateInventoryReport() {
    const [inventory, lowStock] = await Promise.all([
      prisma.inventory.findMany({
        include: { product: true, warehouse: true },
      }),
      prisma.$queryRaw<{ id: string; quantity: number; min_stock: number }[]>`
        SELECT id, quantity, min_stock FROM inventory WHERE quantity <= min_stock
      `,
    ]);

    const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

    return {
      totalItems,
      warehouseCount: new Set(inventory.map((i) => i.warehouseId)).size,
      productCount: new Set(inventory.map((i) => i.productId)).size,
      lowStockCount: lowStock.length,
      inventory,
      generatedAt: new Date().toISOString(),
    };
  },
};
