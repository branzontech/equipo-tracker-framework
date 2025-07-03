import { permisos } from "../../../../db/models/permisos.model.js";

export const permisosService = {
  async getAll() {
    return await permisos.getAll();
  },

  async asignarPermisosPerfil(perfilId, permisoIds) {
    return await permisos.asignarPermisosPerfil(perfilId, permisoIds);
  },

  async getPermisosPorPerfil(perfilId) {
    return await permisos.getPermisosPorPerfil(perfilId);
  },

  async create(data) {
    return await permisos.create(data);
  },
  async update(id, data) {
    return await permisos.update(id, data);
  },
};
