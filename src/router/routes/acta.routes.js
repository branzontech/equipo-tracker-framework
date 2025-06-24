import express from "express";
import { getActas, getInfoEquipo, updateStatus, getInfoPerifericos, getInfoImpresoras } from "../../pages/productos/controller/acta.controller.js";

const router = express.Router();

router
    .get("/get", getActas)
    .get("/getEquipo/:nro_serie", getInfoEquipo)
    .get("/getPeriferico/:serial", getInfoPerifericos)
    .get("/getImpresora/:serial", getInfoImpresoras)
    .post("/updateStatus", updateStatus)


export default router;
