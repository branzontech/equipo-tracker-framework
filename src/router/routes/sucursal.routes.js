import { Router } from "express";
import {
  getSucursal,
  createSucursal,
  deleteSucursal,
  updateSucursal,
  getSucursalById,
} from "../../pages/configuracion/maestros/controller/sucursales.controller.js";
const router = Router();

router
  .get("/get", getSucursal)
  .get("/get/:id", getSucursalById)
  .post("/create", createSucursal)
  .put("/update/:id", updateSucursal)
  .delete("/delete/:id", deleteSucursal);

export default router;
