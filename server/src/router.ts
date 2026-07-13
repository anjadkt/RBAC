import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import permissionRoutes from "./modules/permission/permission.routes";
import roleRoutes from "./modules/role/role.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);


export default router;
