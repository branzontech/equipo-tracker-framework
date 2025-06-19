import express from "express";
import { findAllDevoluciones, findEquiposEnMovimiento, create } from "../../pages/productos/controller/devolucion.controller.js";

const router = express.Router();

router
    .get("/get", findAllDevoluciones)
    .get("/getEquipos", findEquiposEnMovimiento)
    .post("/create", create);

export default router;
