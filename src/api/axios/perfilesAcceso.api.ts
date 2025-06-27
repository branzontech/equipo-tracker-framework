import { PerfilAcceso } from "@/pages/configuracion/maestros/interfaces/perfilAcceso";
import api from "./axiosConfig";

export const getPerfilesAcceso = async () => {
  try {
    const response = await api.get("/perfiles-acceso/get");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los perfiles de acceso:", error);
    throw new Error(
      "Error al obtener los perfiles de acceso: " + error.message
    );
  }
};

export const createPerfilesAcceso = async (data: PerfilAcceso) => {
  try {
    const response = await api.post("/perfiles-acceso/create", data);
    return response.data;
  } catch (error) {
    console.error("Error al crear el perfil de acceso:", error);
    throw new Error("Error al crear el perfil de acceso: " + error.message);
  }
};

export const getPerfilesAccesoById = async (id: number) => {
  try {
    const response = await api.get(`/perfiles-acceso/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener el perfil de acceso:", error);
    throw new Error("Error al obtener el perfil de acceso: " + error.message);
  }
};

export const updatePerfilesAcceso = async (
  id: number,
  perfilAcceso: PerfilAcceso
) => {
  try {
    const response = await api.put(
      `/perfiles-acceso/update/${id}`,
      perfilAcceso
    );
    return response.data;
  } catch (error) {
    console.error("Error al actualizar el perfil de acceso:", error);
    throw new Error(
      "Error al actualizar el perfil de acceso: " + error.message
    );
  }
};
