import express from "express";
import {
  delete_,
  getAll,
  getById,
  update,
  createImpresora,
  getBySerial,
} from "../../pages/toners/controller/impresora.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .get("/:id", getById)
  .get("/get/:serial", getBySerial)
  .post("/create", createImpresora)
  .put("/update", update)
  .delete("/delete/:id", delete_);

export default router;
