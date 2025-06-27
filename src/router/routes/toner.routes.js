import express from "express";
import {
  getAll,
  getById,
  createToner,
  updateToner,
  deleteToner,
  getBySerial,
  createSalidaToner
} from "../../pages/toners/controller/toners.controller.js";

const router = express.Router();

router
    .get("/get", getAll)
    .get("/get/:id", getById)
    .get("/getToner/:serial", getBySerial)
    .post("/create", createToner)
    .put("/update/:id", updateToner)
    .delete("/delete/:id", deleteToner)
    .post("/createSalidaToner", createSalidaToner);

export default router;
