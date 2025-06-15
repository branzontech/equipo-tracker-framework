import express from "express";
import { getActas, updateStatus } from "../../pages/productos/controller/acta.controller.js";

const router = express.Router();

router
    .get("/get", getActas)
    .post("/updateStatus", updateStatus)


export default router;
