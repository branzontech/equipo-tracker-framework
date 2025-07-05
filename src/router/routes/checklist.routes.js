import express from "express";
import { createChecklist, getChecklist } from "../../pages/configuracion/checklist/controller/checklist.controller.js";

const router = express.Router();

router
    .post("/create", createChecklist)
    .get("/get", getChecklist);

export default router;