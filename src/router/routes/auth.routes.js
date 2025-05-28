import { Router } from "express";
import login from "../../pages/auth/controller/auth.controller.js";
const router = Router();

router.post("/login", login);

export default router;     
