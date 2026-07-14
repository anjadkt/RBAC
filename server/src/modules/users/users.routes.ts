import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import requirePermission from "../../middlewares/permission.middleware";
import { createUserController, getOneUserController, getUsersController, updateUserController } from "./users.controller";
import { validate } from "../../middlewares/validate.middleware";
import { createUserSchema, updateUserSchema } from "./users.validation";

const router = Router();

router.get('/', authenticate, requirePermission("users.view"), getUsersController);
router.get('/:id', authenticate, requirePermission("users.view"), getOneUserController);
router.post('/', authenticate, requirePermission('users.create'), validate(createUserSchema), createUserController);
router.patch('/:id', authenticate, requirePermission('users.update', 'users.change'), validate(updateUserSchema), updateUserController);

export default router;