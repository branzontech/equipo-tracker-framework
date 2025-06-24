import express from "express";
import {
  create,
  findById,
  update,
  findAll,
  delete_,
  findBySerial,
} from "../../pages/configuracion/maestros/controller/periferico.controller.js";

const router = express.Router();

router
    .post("/create", create)
    .get("/get", findAll)
    .get("/get/:id", findById)
    .get("/getPeriferico/:serial", findBySerial)
    .put("/:id", update)
    .delete("/:id", delete_)

export default router;