import { Router } from "express";
import { getUbi, createUbi } from "../../pages/configuracion/maestros/controller/ubi.controller.js";
const router = Router();

router
    .get("/get", getUbi)
    .post("/create", createUbi);

export default router;