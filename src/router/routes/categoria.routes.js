import express from "express";
import { getAll, create, deleteC, update, getById } from "../../pages/configuracion/maestros/controller/categoria.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .get("/get/:id", getById)
  .put("/update/:id", update)
  .post("/create", create)
  .delete("/delete/:id", deleteC)

export default router;