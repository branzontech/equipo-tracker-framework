import { Router } from "express";
import {
  getSedes,
  createSede,
} from "../../pages/configuracion/maestros/controller/sedes.controller.js";
const router = Router();

router
  .get("/get", getSedes)
  .post("/create", createSede);

export default router;
