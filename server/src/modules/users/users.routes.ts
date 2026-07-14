import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { createUserController, getOneUserController, getUsersController, updateUserController, toggleStatusController } from "./users.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "./users.validation";

const router = Router();

router.get('/', authenticate, requirePermission("users.view"), getUsersController);
router.get('/:id', authenticate, requirePermission("users.view"), getOneUserController);
router.post('/', authenticate, requirePermission('users.create'), validate(createUserSchema), createUserController);
router.patch('/:id', authenticate, requirePermission('users.update'), validate(updateUserSchema), updateUserController);
router.patch('/:id/status', authenticate, requirePermission('users.change'), toggleStatusController);

export default router;