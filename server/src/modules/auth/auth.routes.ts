import { Router } from "express";
import { login, logout, register, getMe, refresh } from "./auth.controller";
import authenticate from "../../middlewares/auth.middleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);

router.use(authenticate);

router.get("/refresh", refresh);
router.get("/me", getMe)
router.get("/logout", logout);


export default router;