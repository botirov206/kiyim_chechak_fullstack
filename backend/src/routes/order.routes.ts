import { Router } from "express";
import { orderController } from "../controllers/order.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createOrderSchema, updateOrderSchema } from "../validators/order.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);

router.get("/", validate(paginationSchema, "query"), orderController.getAll);
router.get("/:id", validate(idParamSchema, "params"), orderController.getById);
router.post("/", authorizeMinRole("EMPLOYEE"), validate(createOrderSchema), orderController.create);
router.put(
  "/:id",
  authorizeMinRole("EMPLOYEE"),
  validate(idParamSchema, "params"),
  validate(updateOrderSchema),
  orderController.update
);
router.delete("/:id", authorizeMinRole("MANAGER"), validate(idParamSchema, "params"), orderController.remove);

export default router;
