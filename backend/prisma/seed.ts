import "dotenv/config";
import { Role, ReportType } from "@prisma/client";
import bcrypt from "bcrypt";
import { prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 12;

const SEED_MARKER_EMAIL = "contact@acme.com";

async function createAdminUser() {
  const email = "admin@example.com";
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return existing;

  const passwordHash = await bcrypt.hash("Admin123!", SALT_ROUNDS);

  return prisma.user.create({
    data: {
      email,
      password: passwordHash,
      firstName: "System",
      lastName: "Admin",
      role: Role.ADMIN,
      isActive: true,
    },
  });
}

async function upsertCustomer(data: {
  name: string;
  email: string;
  phone: string;
  address: string;
  company: string;
}) {
  return prisma.customer.upsert({
    where: { email: data.email },
    update: {},
    create: data,
  });
}

async function upsertWarehouse(data: {
  name: string;
  code: string;
  location: string;
  capacity: number;
}) {
  return prisma.warehouse.upsert({
    where: { code: data.code },
    update: {},
    create: data,
  });
}

async function upsertProduct(data: {
  sku: string;
  name: string;
  description: string;
  price: number;
  category: string;
}) {
  return prisma.product.upsert({
    where: { sku: data.sku },
    update: {},
    create: data,
  });
}

async function createSampleData(adminId: string) {
  const alreadySeeded = await prisma.customer.findUnique({
    where: { email: SEED_MARKER_EMAIL },
  });

  if (alreadySeeded) {
    console.log("Sample data already exists, skipping.");
    return;
  }

  const customers = await Promise.all([
    upsertCustomer({
      name: "Acme Corporation",
      email: "contact@acme.com",
      phone: "+1 555-0100",
      address: "123 Industrial Ave",
      company: "Acme Corp",
    }),
    upsertCustomer({
      name: "Globex Inc.",
      email: "info@globex.com",
      phone: "+1 555-0200",
      address: "456 Commerce St",
      company: "Globex",
    }),
  ]);

  const warehouses = await Promise.all([
    upsertWarehouse({
      name: "Main Warehouse",
      code: "MAIN",
      location: "HQ",
      capacity: 10000,
    }),
    upsertWarehouse({
      name: "Secondary Warehouse",
      code: "SEC",
      location: "City Outskirts",
      capacity: 5000,
    }),
  ]);

  const products = await Promise.all([
    upsertProduct({
      sku: "SKU-1001",
      name: "Standard Widget",
      description: "General purpose widget",
      price: 19.99,
      category: "Widgets",
    }),
    upsertProduct({
      sku: "SKU-1002",
      name: "Premium Widget",
      description: "High-end widget",
      price: 49.99,
      category: "Widgets",
    }),
    upsertProduct({
      sku: "SKU-2001",
      name: "Gadget",
      description: "Useful gadget",
      price: 29.99,
      category: "Gadgets",
    }),
  ]);

  for (const product of products) {
    for (const warehouse of warehouses) {
      await prisma.inventory.upsert({
        where: {
          productId_warehouseId: {
            productId: product.id,
            warehouseId: warehouse.id,
          },
        },
        update: {},
        create: {
          productId: product.id,
          warehouseId: warehouse.id,
          quantity: Math.floor(Math.random() * 200) + 10,
          minStock: 20,
        },
      });
    }
  }

  const customer = customers[0];
  const product = products[0];

  const existingOrder = await prisma.order.findUnique({
    where: { orderNumber: "ORD-SEED-0001" },
  });

  if (!existingOrder) {
    const order = await prisma.order.create({
      data: {
        orderNumber: "ORD-SEED-0001",
        customerId: customer.id,
        status: "CONFIRMED",
        totalAmount: product.price,
        notes: "Sample seeded order",
        items: {
          create: [
            {
              productId: product.id,
              quantity: 1,
              unitPrice: product.price,
              subtotal: product.price,
            },
          ],
        },
      },
    });

    const existingReport = await prisma.report.findFirst({
      where: { title: "Initial Sales Report", createdById: adminId },
    });

    if (!existingReport) {
      await prisma.report.create({
        data: {
          title: "Initial Sales Report",
          type: ReportType.SALES,
          description: "Auto-generated initial report",
          data: {
            note: "Seeded data",
            orderId: order.id,
          },
          createdById: adminId,
        },
      });
    }
  }
}

export async function main() {
  console.log("Seeding database...");
  const admin = await createAdminUser();
  await createSampleData(admin.id);
  console.log("Database seeded successfully.");
}

if (require.main === module) {
  main()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
