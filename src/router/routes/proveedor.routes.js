import express from "express";
import {
  createProveedor,
  getAllProveedores,
  getProveedorByName,
} from "../../pages/configuracion/maestros/controller/proveedor.controller.js";

const router = express.Router();

router
  .get("/get", getAllProveedores)
  .get("/get/:name", getProveedorByName)
  .post("/create", createProveedor);

export default router;
