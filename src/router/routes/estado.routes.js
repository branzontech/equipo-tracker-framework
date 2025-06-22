import { Router } from "express";
import { createEstado, getAllEstados } from "../../pages/configuracion/maestros/controller/estado.controller.js";

const router = Router();

router
    .post("/create", createEstado)
    .get("/get", getAllEstados);

export default router;