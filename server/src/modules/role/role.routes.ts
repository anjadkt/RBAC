import { Router } from "express";
import authenticate from "../../middlewares/auth.middleware";
import authorize from "../../middlewares/permission.middleware";
import { createRole, getRoles } from "./role.controller";

const router = Router();

router.use(authenticate);

router.get("/", authorize("roles.view"), getRoles);
router.post("/", authorize("roles.create"), createRole);

export default router;