import { Router } from "express";
import {
  findAll,
  findByName,
} from "../../pages/usuarios/controller/user.controller.js";
const router = Router();

router
    .get("/get", findAll)
    .get("/get/:name", findByName);

export default router;
