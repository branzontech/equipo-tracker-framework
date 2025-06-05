import { Router } from "express";
import { getSucursal, createSucursal, deleteSucursal } from "../../pages/configuracion/maestros/controller/sucursales.controller.js";
const router = Router();

router
    .get("/get", getSucursal)
    .post("/create", createSucursal)
    .delete("/delete/:id", deleteSucursal);

export default router;