import { Impresora } from "@/pages/toners/interfaces/impresora";
import api from "./axiosConfig";

export const getImpresora = async () => {
  const response = await api.get("/impresoras/get");
  return response.data.impresoras;
};

export const createImpresora = async (impresora: Impresora) => {
  const response = await api.post("/impresoras/create", impresora);
  return response;
};

export const deleteImpresora = async (id: number) => {
  const response = await api.delete(`/impresoras/delete/${id}`);
  return response.data;
};
