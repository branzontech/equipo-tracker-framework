import { Router } from "express";
import {
  getSedes,
  getSedeById,
  createSede,
  deleteSede,
  updateSede,
} from "../../pages/configuracion/maestros/controller/sedes.controller.js";
const router = Router();

router
  .get("/get", getSedes)
  .get("/get/:id", getSedeById)
  .post("/create", createSede)
  .delete("/delete/:id", deleteSede)
  .put("/update/:id", updateSede)

export default router;
