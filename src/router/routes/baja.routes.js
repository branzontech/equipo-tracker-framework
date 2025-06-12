import express from "express";
import { getAllBajas, createBaja } from "../../pages/productos/controller/baja.controller.js";

const router = express.Router();

router
    .get("/get", getAllBajas)
    .post("/create", createBaja);

export default router;
