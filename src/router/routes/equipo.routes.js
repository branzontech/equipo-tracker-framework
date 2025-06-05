import express from "express";
import { create, findAll } from "../../pages/productos/controller/equipo.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .get("/get", findAll);

export default router;