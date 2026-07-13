import { Router } from "express";
import { loginController, logoutController, registerController, getMeController, refreshController } from "./auth.controller";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema, registerSchema } from "./auth.validate";

const router = Router();

router.post("/register", validate(registerSchema), registerController);
router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController)
router.get("/refresh", authenticate, refreshController);
router.get("/logout", authenticate, logoutController);


export default router;