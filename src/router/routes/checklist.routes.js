import express from "express";
import {
  createChecklist,
  getChecklist,
  getChecklistById,
  updateChecklist,
  disableChecklist,
  enableChecklist,
} from "../../pages/configuracion/checklist/controller/checklist.controller.js";

const router = express.Router();

router
  .post("/create", createChecklist)
  .get("/get", getChecklist)
  .get("/get/:id", getChecklistById)
  .put("/update/:id", updateChecklist)
  .put("/disable/:id", disableChecklist)
  .put("/enable/:id", enableChecklist);

export default router;