import { Router } from "express";
import { findAll } from "../../pages/usuarios/controller/user.controller.js";
const router = Router();

router.get("/get", findAll);

export default router;