import { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma";
import { AppError, NotFoundError } from "../utils/errors";
import { PaginationQuery, getPaginationParams } from "../utils/pagination";
import { OrderStatus } from "@prisma/client";

const generateOrderNumber = (): string => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
};

export const orderService = {
  async findAll(query: PaginationQuery) {
    const { page, limit, skip } = getPaginationParams(query);
    const where = query.search
      ? {
          OR: [
            { orderNumber: { contains: query.search, mode: "insensitive" as const } },
            { customer: { name: { contains: query.search, mode: "insensitive" as const } } },
          ],
        }
      : {};

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip,
        take: limit,
        include: { customer: true, items: { include: { product: true } } },
        orderBy: { createdAt: "desc" },
      }),
      prisma.order.count({ where }),
    ]);

    return { orders, total, page, limit };
  },

  async findById(id: string) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });
    if (!order) throw new NotFoundError("Order");
    return order;
  },

  async create(data: {
    customerId: string;
    status: OrderStatus;
    notes?: string | null;
    items: { productId: string; quantity: number }[];
  }) {
    const customer = await prisma.customer.findUnique({ where: { id: data.customerId } });
    if (!customer) throw new NotFoundError("Customer");

    const productIds = data.items.map((i) => i.productId);
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });

    if (products.length !== productIds.length) {
      throw new AppError("One or more products not found", 400);
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = new Prisma.Decimal(0);

    const orderItems = data.items.map((item) => {
      const product = productMap.get(item.productId)!;
      const unitPrice = product.price;
      const subtotal = unitPrice.mul(item.quantity);
      totalAmount = totalAmount.add(subtotal);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    return prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: data.customerId,
        status: data.status,
        notes: data.notes,
        totalAmount,
        items: { create: orderItems },
      },
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });
  },

  async update(
    id: string,
    data: Partial<{
      customerId: string;
      status: OrderStatus;
      notes: string | null;
    }>
  ) {
    await this.findById(id);
    return prisma.order.update({
      where: { id },
      data,
      include: {
        customer: true,
        items: { include: { product: true } },
      },
    });
  },

  async delete(id: string) {
    await this.findById(id);
    await prisma.order.delete({ where: { id } });
  },
};
