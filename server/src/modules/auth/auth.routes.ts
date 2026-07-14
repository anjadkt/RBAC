import { Router } from "express";
import { loginController, logoutController, getMeController, refreshController } from "./auth.controller";
import authenticate from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { loginSchema } from "./auth.validate";

const router = Router();

router.post("/login", validate(loginSchema), loginController);
router.get("/me", authenticate, getMeController)
router.get("/refresh", refreshController);
router.get("/logout", authenticate, logoutController);


export default router;