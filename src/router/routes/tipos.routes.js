import { Router } from "express";
import { createTipo, getAllTipos } from "../../pages/configuracion/maestros/controller/tipos.controller.js";

const router = Router();

router
    .post("/create", createTipo)
    .get("/get", getAllTipos);

export default router;
      