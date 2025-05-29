import { Router } from "express";
import getSedes from "../../pages/configuracion/maestros/controller/sedes.controller.js";
const router = Router();

router.get("/get", getSedes);

export default router;     
