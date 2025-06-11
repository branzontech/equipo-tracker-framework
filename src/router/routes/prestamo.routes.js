import express from "express";
import { createPrestamo, getPrestamos, saveSign } from "../../pages/productos/controller/prestamo.controller.js";

const router = express.Router();

router
    .post("/create", createPrestamo)
    .get("/get", getPrestamos)
    .post("/saveSign", saveSign)

export default router;