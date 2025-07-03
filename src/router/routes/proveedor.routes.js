import express from "express";
import {
  createProveedor,
  getAllProveedores,
  getProveedorByName,
  getProveedorById,
  updateProveedor,
  deleteProveedor,
} from "../../pages/configuracion/maestros/controller/proveedor.controller.js";

const router = express.Router();

router
  .get("/get", getAllProveedores)
  .get("/get/:name", getProveedorByName)
  .get("/getId/:id", getProveedorById)
  .post("/create", createProveedor)
  .put("/update/:id", updateProveedor)
  .delete("/delete/:id", deleteProveedor)

export default router;
