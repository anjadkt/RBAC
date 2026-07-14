import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { createPermission, getPermissions } from "./permission.controller";
import requirePermission from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { permissionSchema } from "./permission.validation";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission("rbac.permission.view"), getPermissions);
router.post("/", requirePermission("rbac.permission.create"), validate(permissionSchema), createPermission);


export default router;