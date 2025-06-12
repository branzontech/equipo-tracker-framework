import express from "express";
import { getAll, create } from "../../pages/productos/controller/traslado.controller.js";

const router = express.Router();

router
    .get("/get", getAll)
    .post("/create", create)

export default router;