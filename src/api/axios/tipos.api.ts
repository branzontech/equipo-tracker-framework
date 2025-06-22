import { Tipos } from "@/pages/configuracion/maestros/interfaces/tipos";
import api from "./axiosConfig";

export const getAllTipos = async () => {
  const response = await api.get("/tipos/get");
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
