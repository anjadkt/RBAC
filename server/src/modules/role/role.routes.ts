import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/permission.middleware";
import { createRole, getRoles, updateRole } from "./role.controller";
import { validate } from "../../middlewares/validate.middleware";
import { roleSchema, roleUpdateSchema } from "./role.validate";

const router = Router();

router.get("/", authenticate, authorize("role.view"), getRoles);
router.post("/", authenticate, authorize("role.create"), validate(roleSchema), createRole);
router.patch("/:roleId", authenticate, authorize("role.update"), validate(roleUpdateSchema), updateRole);

export default router;