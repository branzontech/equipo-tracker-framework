import { Estados } from "@/pages/configuracion/maestros/interfaces/estado";
import api from "./axiosConfig";

export const getAllEstados = async () => {
  const response = await api.get("/estados/get");
  return response.data;
};

export const createEstado = async (estado: Estados) => {
  try {
    const response = await api.post("/estados/create", estado);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.response?.message);
  }
};

export const getEstadoById = async (id: number) => {
  const response = await api.get(`/estados/get/${id}`);
  return response.data;
};

export const updateEstado = async (id: number, estado: Estados) => {
  try {
    const response = await api.put(`/estados/update/${id}`, estado);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.response?.message);
  }
};