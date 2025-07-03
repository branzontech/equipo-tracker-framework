import { Router } from "express";
import {
  createTipo,
  getAllTipos,
  getTipoById,
  updateTipo,
  deleteTipo,
} from "../../pages/configuracion/maestros/controller/tipos.controller.js";

const router = Router();

router
  .post("/create", createTipo)
  .get("/get", getAllTipos)
  .get("/get/:id", getTipoById)
  .post("/update/:id", updateTipo)
  .delete("/delete/:id", deleteTipo);

export default router;
