import express from "express";
import multer from "multer";
import {
  getAll,
  getById,
  createM,
  updateStatus,
  delete_,
  uploadFiles,
  getFiles,
  actualizarProgreso,
  saveResponse,
  getCheckListResponses,
  finalizeChecklistResponse
} from "../../pages/mantenimientos/controller/mante.controller.js";
const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router
  .get("/get", getAll)
  .get("/get/:id", getById)
  .post("/create", createM)
  .put("/update/:id", updateStatus)
  .post("/upload/:id", upload.array("files"), uploadFiles)
  .get("/files", getFiles)
  .delete("/delete/:id", delete_)
  .put("/actualizar-progreso/:id", actualizarProgreso)
  .put("/save-response/:id", saveResponse)
  .get("/get-checklist-responses/:id", getCheckListResponses)
  .put("/finalize-checklist-response/:id", finalizeChecklistResponse);

export default router;
