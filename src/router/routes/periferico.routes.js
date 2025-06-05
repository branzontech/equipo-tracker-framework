import express from "express";
import {
  create,
  findAll,
  delete_,
} from "../../pages/configuracion/maestros/controller/periferico.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .get("/get", findAll)
    .delete("/:id", delete_);

export default router;