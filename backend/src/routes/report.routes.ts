import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { authenticate } from "../middleware/auth";
import { authorizeMinRole } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createReportSchema, updateReportSchema } from "../validators/report.validator";
import { idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);
router.use(authorizeMinRole("MANAGER"));

router.get("/", validate(paginationSchema, "query"), reportController.getAll);
router.get("/:id", validate(idParamSchema, "params"), reportController.getById);
router.post("/", validate(createReportSchema), reportController.create);
router.post("/generate/sales", reportController.generateSales);
router.post("/generate/inventory", reportController.generateInventory);
router.put(
  "/:id",
  validate(idParamSchema, "params"),
  validate(updateReportSchema),
  reportController.update
);
router.delete("/:id", validate(idParamSchema, "params"), reportController.remove);

export default router;
