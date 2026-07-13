import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import { createPermission, getPermissions } from "./permission.controller";
import authorize from "../../middlewares/permission.middleware";

const router = Router();

router.use(authenticate);

router.get("/", authorize("permissions.view"), getPermissions);
router.post("/", authorize("permissions.create"), createPermission);


export default router;