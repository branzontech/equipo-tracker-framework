import express from "express";
import { createPrestamo, getPrestamos } from "../../pages/productos/controller/prestamo.controller.js";

const router = express.Router();

router
    .post("/create", createPrestamo)
    .get("/get", getPrestamos)

export default router;