import { Router } from "express";
import authRoutes from "./modules/auth/auth.routes";
import permissionRoutes from "./modules/permission/permission.routes";
import roleRoutes from "./modules/role/role.routes";
import moduleRoutes from './modules/module/module.routes';
import operationRoutes from './modules/operation/operation.routes';
import usersRoutes from './modules/users/users.routes';
import employeeRoutes from './modules/employee/employee.routes';

const router = Router();

router.use("/auth", authRoutes);
router.use("/permission", permissionRoutes);
router.use("/role", roleRoutes);
router.use("/module", moduleRoutes);
router.use("/operation", operationRoutes);
router.use("/users", usersRoutes);
router.use("/employee", employeeRoutes)


export default router;
