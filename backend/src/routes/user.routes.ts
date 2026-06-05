import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { authenticate } from "../middleware/auth";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { createUserSchema, updateUserSchema, idParamSchema } from "../validators/user.validator";
import { paginationSchema } from "../utils/pagination";

const router = Router();

router.use(authenticate);
router.use(authorize("ADMIN"));

router.get("/", validate(paginationSchema, "query"), userController.getAll);
router.get("/:id", validate(idParamSchema, "params"), userController.getById);
router.post("/", validate(createUserSchema), userController.create);
router.put("/:id", validate(idParamSchema, "params"), validate(updateUserSchema), userController.update);
router.delete("/:id", validate(idParamSchema, "params"), userController.remove);

export default router;
