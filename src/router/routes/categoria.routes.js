import express from "express";
import { getAll, create, deleteC } from "../../pages/configuracion/maestros/controller/categoria.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .post("/create", create)
  .delete("/delete/:id", deleteC);

export default router;