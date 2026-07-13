import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { createPermission, getPermissions } from "./permission.controller";
import requirePermission from "../../middlewares/permission.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { permissionSchema } from "./permission.validation";

const router = Router();

router.use(authenticate);

router.get("/", requirePermission("permissions.view"), getPermissions);
router.post("/", requirePermission("permissions.create"), validate(permissionSchema), createPermission);


export default router;