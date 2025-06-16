import express from "express";
import { getActas, getInfoEquipo, updateStatus } from "../../pages/productos/controller/acta.controller.js";

const router = express.Router();

router
    .get("/get", getActas)
    .get("/getEquipo/:nro_serie", getInfoEquipo)
    .post("/updateStatus", updateStatus)


export default router;
