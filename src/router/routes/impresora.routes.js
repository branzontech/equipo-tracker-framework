import express from "express";
import {
  delete_,
  getAll,
  getById,
  update,
  createImpresora,
} from "../../pages/toners/controller/impresora.controller.js";

const router = express.Router();

router
  .get("/get", getAll)
  .get("/:id", getById)
  .post("/create", createImpresora)
  .put("/update", update)
  .delete("/delete/:id", delete_);

export default router;
