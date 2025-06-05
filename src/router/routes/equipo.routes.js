import express from "express";
import { create, findAll, findAllById, delete_ } from "../../pages/productos/controller/equipo.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .get("/get", findAll)
    .get("/:nro_serie", findAllById)
    .delete("/:id", delete_);

export default router;