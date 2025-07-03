import { Router } from "express";
import {
  createEstado,
  getAllEstados,
  getEstadoById,
  updateEstado,
} from "../../pages/configuracion/maestros/controller/estado.controller.js";

const router = Router();

router
  .post("/create", createEstado)
  .get("/get", getAllEstados)
  .get("/get/:id", getEstadoById)
  .put("/update/:id", updateEstado);

export default router;
