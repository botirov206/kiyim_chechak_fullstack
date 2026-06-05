import { Router } from "express";
import { productController } from "../controllers/product.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createProductSchema, updateProductSchema } from "../validators/product.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);

router.get("/", validate(paginationSchema, "query"), productController.getAll);
router.get("/:id", validate(idParamSchema, "params"), productController.getById);
router.post("/", authorizeMinRole("MANAGER"), validate(createProductSchema), productController.create);
router.put(
  "/:id",
  authorizeMinRole("MANAGER"),
  validate(idParamSchema, "params"),
  validate(updateProductSchema),
  productController.update
);
router.delete("/:id", authorizeMinRole("ADMIN"), validate(idParamSchema, "params"), productController.remove);

export default router;
