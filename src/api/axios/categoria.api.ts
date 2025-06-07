import { Categoria } from "@/pages/configuracion/maestros/interfaces/categorias";
import api from "./axiosConfig";

export const getAllCategorias = async () => {
  const response = await api.get("/categorias/get");
  return response.data;
};

export const getCategoriaById = async (id: number) => {
  const response = await api.get(`/categorias/get/${id}`);
  return response.data;
};

export const updateCategoria = async (id: number, categoria: Categoria) => {
  const response = await api.put(`/categorias/update/${id}`, categoria);
  return response.data;
};

export const createCategoria = async (categoria: Categoria) => {
  const response = await api.post("/categorias/create", categoria);
  return response.data;
};

export const deleteCategoria = async (id: number) => {
  const response = await api.delete(`categorias/delete/${id}`);
  return response.data;
};
