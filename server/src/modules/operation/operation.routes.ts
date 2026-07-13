import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createOperation, getOperations } from "./operation.controller";
import { operationSchema } from "./operation.validation";

const router = Router();

router.get("/", authenticate, requirePermission("operation.view"), getOperations)
router.post("/", authenticate, requirePermission("operation.create"), validate(operationSchema), createOperation);


export default router;