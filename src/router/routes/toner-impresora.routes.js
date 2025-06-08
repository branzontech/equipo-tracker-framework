import express from "express";
import {
  getAll,
} from "../../pages/toners/controller/toner_impresora.controller.js";

const router = express.Router();

router
    .get("/get", getAll)

export default router;