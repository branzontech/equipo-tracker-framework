import { Permiso } from "@/pages/configuracion/usuarios/interfaces/permisos";
import api from "./axiosConfig";

export const getPermisos = async () => {
  const response = await api.get("/permisos/get");
  return response.data;
};

export const asignarPermisosPerfil = async (
  perfilId: number,
  permisoIds: number[]
) => {
  const response = await api.post("/permisos/asignar-permisos", {
    perfilId,
    permisoIds,
  });
  return response.data;
};

export const getPermisosPorPerfil = async (perfilId: number) => {
  const response = await api.get(`/permisos/perfil/${perfilId}`);
  return response.data;
};

export const createPermiso = async (data: Permiso) => {
  const response = await api.post("/permisos/create", data);
  return response.data;
};

export const updatePermiso = async (id: number, data: Permiso) => {
  const response = await api.put(`/permisos/update/${id}`, data);
  return response.data;
};
