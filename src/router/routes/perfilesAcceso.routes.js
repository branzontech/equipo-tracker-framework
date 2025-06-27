import express from "express";
import {
  createPerfilesAcceso,
  findAllPerfilesAcceso,
  getByIdPerfilesAcceso,
  updatePerfilesAcceso,
} from "../../pages/configuracion/maestros/controller/perfilesAcceso.controller.js";

const router = express.Router();

router
    .post("/create", createPerfilesAcceso)
    .get("/get", findAllPerfilesAcceso)
    .get("/get/:id", getByIdPerfilesAcceso)
    .put("/update/:id", updatePerfilesAcceso);

export default router;