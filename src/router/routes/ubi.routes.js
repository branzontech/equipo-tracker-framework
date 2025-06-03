import { Router } from "express";
import { getUbi, createUbi, deleteUbi } from "../../pages/configuracion/maestros/controller/ubi.controller.js";
const router = Router();

router
    .get("/get", getUbi)
    .post("/create", createUbi)
    .delete("/delete/:id", deleteUbi);

export default router;