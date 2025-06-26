import express from "express";
import {
  getAll,
  getById,
} from "../../pages/toners/controller/toner_impresora.controller.js";

const router = express.Router();

router
    .get("/get", getAll)
    .get("/get/:id", getById);

export default router;