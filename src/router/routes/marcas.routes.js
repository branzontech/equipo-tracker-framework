import express from "express";
import {
  create,
  deleteM,
  getAll,
  update,
  getById,
} from "../../pages/configuracion/maestros/controller/marcas.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .get("/get/:id", getById)
  .post("/create", create)
  .put("/update/:id", update)
  .delete("/delete/:id", deleteM);

export default router;
