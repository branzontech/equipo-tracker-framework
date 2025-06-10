import express from "express";
import { createContrato, getContratos } from "../../pages/contratos/controller/contrato.controller.js";

const router = express.Router();

router
    .get("/get", getContratos)
    .post("/create", createContrato);

export default router;