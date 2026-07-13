import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createOperation, getOperations } from "./operation.controller";
import { operationSchema } from "./operation.validation";

const router = Router();

router.get("/", authenticate, authorize("operation.view"), getOperations)
router.post("/", authenticate, authorize("operation.create"), validate(operationSchema), createOperation);


export default router;