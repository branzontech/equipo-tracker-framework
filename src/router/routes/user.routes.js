import { Router } from "express";
import {
  findAll,
  findByName,
  create,
} from "../../pages/usuarios/controller/user.controller.js";
const router = Router();

router
    .get("/get", findAll)
    .get("/get/:name", findByName)
    .post("/create", create);

export default router;
