import { Router } from "express";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import customerRoutes from "./customer.routes";
import productRoutes from "./product.routes";
import warehouseRoutes from "./warehouse.routes";
import inventoryRoutes from "./inventory.routes";
import orderRoutes from "./order.routes";
import reportRoutes from "./report.routes";

const router = Router();

router.get("/health", (_req, res) => {
  res.json({
    success: true,
    message: "Cloud ERP CRM WMS API is running",
    timestamp: new Date().toISOString(),
  });
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/customers", customerRoutes);
router.use("/products", productRoutes);
router.use("/warehouses", warehouseRoutes);
router.use("/inventory", inventoryRoutes);
router.use("/orders", orderRoutes);
router.use("/reports", reportRoutes);

export default router;
