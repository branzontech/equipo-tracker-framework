import { Router } from "express";
import {
  getSedes,
  createSede,
  deleteSede,
} from "../../pages/configuracion/maestros/controller/sedes.controller.js";
const router = Router();

router
  .get("/get", getSedes)
  .post("/create", createSede)
  .delete("/delete/:id", deleteSede);

export default router;
