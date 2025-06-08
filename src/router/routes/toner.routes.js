import express from "express";
import {
  getAll,
  getById,
  createToner,
  updateToner,
  deleteToner,
} from "../../pages/toners/controller/toners.controller.js";

const router = express.Router();

router
    .get("/get", getAll)
    .get("/get/:id", getById)
    .post("/create", createToner)
    .put("/update/:id", updateToner)
    .delete("/delete/:id", deleteToner)

export default router;
