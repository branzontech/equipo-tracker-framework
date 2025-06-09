import { Marca } from "@/pages/configuracion/maestros/interfaces/marcas";
import api from "./axiosConfig";

export const getAllMarcas = async () => {
  const response = await api.get("/marcas/get");
  return response.data;
};

export const getMarcaById = async (id: number) => {
  const response = await api.get(`/marcas/get/${id}`);
  return response.data;
};

export const updateMarca = async (id: number, marca: Marca) => {
  const response = await api.put(`/marcas/update/${id}`, marca);
  return response.data;
};

export const createMarca = async (marca: Marca) => {
  const response = await api.post("/marcas/create", marca);
  return response.data;
};

export const deleteMarca = async (id: number) => {
  try {
    const response = await api.delete(`marcas/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
