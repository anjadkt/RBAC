import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { moduleSchema } from "./module.validation";
import { createModule, getModule } from "./module.controller";

const router = Router();

router.get("/", authenticate, requirePermission("rbac.module.view"), getModule)
router.post("/", authenticate, requirePermission("rbac.module.create"), validate(moduleSchema), createModule);



export default router;