import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { createUserController, getOneUserController, getUsersController, updateUserController, toggleStatusController } from "./users.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "./users.validation";

const router = Router();

router.get('/', authenticate, requirePermission("users.view"), getUsersController);
router.get('/:id', authenticate, getOneUserController);
router.post('/', authenticate, requirePermission('user.create'), validate(createUserSchema), createUserController);
router.patch('/:id', authenticate, requirePermission('user.update'), validate(updateUserSchema), updateUserController);
router.patch('/:id/status', authenticate, requirePermission('user.change'), toggleStatusController);

export default router;