import { Router } from "express";
import {
  getPermisos,
  asignarPermisosPerfil,
  getPermisosPorPerfil,
  createPermiso,
  updatePermiso,
} from "../../pages/configuracion/usuarios/controller/permisos.controller.js";

const router = Router();

router
  .get("/get", getPermisos)
  .get("/perfil/:perfilId", getPermisosPorPerfil)
  .post("/asignar-permisos", asignarPermisosPerfil)
  .post("/create", createPermiso)
  .put("/update/:id", updatePermiso);

export default router;