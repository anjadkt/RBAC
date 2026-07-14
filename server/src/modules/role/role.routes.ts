import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { createRole, getRoles, updateRole } from "./role.controller";
import { validate } from "../../middlewares/validate.middleware";
import { roleSchema, roleUpdateSchema } from "./role.validate";

const router = Router();

router.get("/", authenticate, requirePermission("rbac.role.view", "role.view"), getRoles);
router.post("/", authenticate, requirePermission("rbac.role.create"), validate(roleSchema), createRole);
router.patch("/:roleId", authenticate, requirePermission("rbac.role.update"), validate(roleUpdateSchema), updateRole);

export default router;