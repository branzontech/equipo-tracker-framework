import { Equipo } from "@/pages/productos/interfaces/equipo";
import api from "./axiosConfig";

export const getEquipos = async () => {
  try {
    const response = await api.get("/equipos/get");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const createEquipo = async (equipo: Equipo) => {
  try {
    const response = await api.post("/equipos/create", equipo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const updateEquipo = async (equipo: Equipo) => {
  try {
    const response = await api.post("/equipos/update", equipo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getEquiposByNroSerie = async (nroSerie: string) => {
  try {
    const response = await api.get(`/equipos/${nroSerie}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const deleteEquipo = async (id: number) => {
  try {
    const response = await api.delete(`/equipos/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
