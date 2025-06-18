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
  .delete("/delete/:id", delete_);

export default router;
