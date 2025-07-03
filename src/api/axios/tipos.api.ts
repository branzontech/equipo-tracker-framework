import { Tipos } from "@/pages/configuracion/maestros/interfaces/tipos";
import api from "./axiosConfig";

export const getAllTipos = async () => {
  const response = await api.get("/tipos/get");
  return response.data;
};

export const getTipoById = async (id: number) => {
  const response = await api.get(`/tipos/get/${id}`);
  return response.data;
};

export const createTipo = async (tipo: Tipos) => {
  try {
    const response = await api.post("/tipos/create", tipo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.response?.message);
  }
};

export const updateTipo = async (id: number, tipo: Tipos) => {
  try {
    const response = await api.post(`/tipos/update/${id}`, tipo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.response?.message);
  }
};

export const deleteTipo = async (id: number) => {
  try {
    const response = await api.delete(`/tipos/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.response?.message);
  }
};
