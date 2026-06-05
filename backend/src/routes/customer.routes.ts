import { Router } from "express";
import { customerController } from "../controllers/customer.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createCustomerSchema, updateCustomerSchema } from "../validators/customer.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);

router.get("/", validate(paginationSchema, "query"), customerController.getAll);
router.get("/:id", validate(idParamSchema, "params"), customerController.getById);
router.post("/", authorizeMinRole("MANAGER"), validate(createCustomerSchema), customerController.create);
router.put(
  "/:id",
  authorizeMinRole("MANAGER"),
  validate(idParamSchema, "params"),
  validate(updateCustomerSchema),
  customerController.update
);
router.delete("/:id", authorizeMinRole("ADMIN"), validate(idParamSchema, "params"), customerController.remove);

export default router;
