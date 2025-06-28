import { Router } from "express";
import {
  getPermisos,
  asignarPermisosPerfil,
  getPermisosPorPerfil,
} from "../../pages/configuracion/usuarios/controller/permisos.controller.js";

const router = Router();

router
  .get("/get", getPermisos)
  .get("/perfil/:perfilId", getPermisosPorPerfil)
  .post("/asignar-permisos", asignarPermisosPerfil)

export default router;