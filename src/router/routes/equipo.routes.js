import express from "express";
import { create, findAll, findAllById } from "../../pages/productos/controller/equipo.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .get("/get", findAll)
    .get("/:nro_serie", findAllById)

export default router;