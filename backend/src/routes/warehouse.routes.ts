import { Router } from "express";
import { warehouseController } from "../controllers/warehouse.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createWarehouseSchema, updateWarehouseSchema } from "../validators/warehouse.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);

router.get("/", validate(paginationSchema, "query"), warehouseController.getAll);
router.get("/:id", validate(idParamSchema, "params"), warehouseController.getById);
router.post("/", authorizeMinRole("MANAGER"), validate(createWarehouseSchema), warehouseController.create);
router.put(
  "/:id",
  authorizeMinRole("MANAGER"),
  validate(idParamSchema, "params"),
  validate(updateWarehouseSchema),
  warehouseController.update
);
router.delete("/:id", authorizeMinRole("ADMIN"), validate(idParamSchema, "params"), warehouseController.remove);

export default router;
