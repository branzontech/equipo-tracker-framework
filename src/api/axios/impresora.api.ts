import { Impresora } from "@/pages/toners/interfaces/impresora";
import api from "./axiosConfig";

export const getImpresora = async () => {
  const response = await api.get("/impresoras/get");
  return response.data.impresoras;
};

export const getImpresoraById = async (id: number) => {
  const response = await api.get(`/impresoras/${id}`);
  return response.data;
};

export const getImpresoraBySerial = async (serial: string) => {
  try {
    const response = await api.get(`/impresoras/get/${serial}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching impresora by serial:", error);
    throw error;
  }
};

export const updateImpresora = async (id: number, impresora: Impresora) => {
  const response = await api.put(`/impresoras/update/${id}`, impresora);
  return response.data;
};

export const createImpresora = async (impresora: Impresora) => {
  const response = await api.post("/impresoras/create", impresora);
  return response;
};

export const deleteImpresora = async (id: number) => {
  try {
  const response = await api.delete(`/impresoras/delete/${id}`);
  return response.data;
  } catch (error) {
    ;
  }
};
