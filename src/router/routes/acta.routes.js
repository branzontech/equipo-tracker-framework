import express from "express";
import { getActas } from "../../pages/productos/controller/acta.controller.js";

const router = express.Router();

router.get("/get", getActas);

export default router;
