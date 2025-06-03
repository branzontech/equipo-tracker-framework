import express from "express";
import {
  create,
  deleteM,
  getAll,
} from "../../pages/configuracion/maestros/controller/marcas.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .post("/create", create)
  .delete("/delete/:id", deleteM);

export default router;
