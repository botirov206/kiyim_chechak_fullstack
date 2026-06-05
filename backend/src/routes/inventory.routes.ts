import { Router } from "express";
import { inventoryController } from "../controllers/inventory.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createInventorySchema, updateInventorySchema } from "../validators/inventory.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);

router.get("/", validate(paginationSchema, "query"), inventoryController.getAll);
router.get("/low-stock", inventoryController.getLowStock);
router.get("/:id", validate(idParamSchema, "params"), inventoryController.getById);
router.post("/", authorizeMinRole("MANAGER"), validate(createInventorySchema), inventoryController.create);
router.put(
  "/:id",
  authorizeMinRole("EMPLOYEE"),
  validate(idParamSchema, "params"),
  validate(updateInventorySchema),
  inventoryController.update
);
router.delete("/:id", authorizeMinRole("ADMIN"), validate(idParamSchema, "params"), inventoryController.remove);

export default router;
