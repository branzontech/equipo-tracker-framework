import express from "express";
import {
  createProveedor,
  getAllProveedores,
} from "../../pages/configuracion/maestros/controller/proveedor.controller.js";

const router = express.Router();

router.get("/get", getAllProveedores)
      .post("/create", createProveedor);

export default router;
