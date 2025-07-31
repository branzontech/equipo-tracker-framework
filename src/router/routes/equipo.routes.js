import express from "express";
import { create, findAll, findAllById, delete_, update, getTrazabilidadByEquipoId } from "../../pages/productos/controller/equipo.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .post("/update", update)
    .get("/get", findAll)
    .get("/trazabilidad/:id_equipo", getTrazabilidadByEquipoId)
    .get("/:nro_serie", findAllById)
    .delete("/delete/:id", delete_);

export default router;