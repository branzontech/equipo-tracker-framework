import { Toner } from "@/pages/toners/interfaces/toners";
import api from "./axiosConfig";

export const getToners = async () => {
  const response = await api.get("/toners/get");
  return response.data.toners;
};

export const getTonerById = async (id: number) => {
  const response = await api.get(`/toners/get/${id}`);
  return response.data;
};

export const createToner = async (toner: Toner) => {
  const response = await api.post("/toners/create", toner);
  return response.data;
};

export const updateToner = async (id: number, toner: Toner) => {
  const response = await api.put(`/toners/update/${id}`, toner);
  return response.data;
};

export const deleteToner = async (id: number) => {
  const response = await api.delete(`/toners/delete/${id}`);
  return response.data;
};
