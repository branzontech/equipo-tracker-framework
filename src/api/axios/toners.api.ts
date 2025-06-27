import { Toner } from "@/pages/toners/interfaces/toners";
import api from "./axiosConfig";
import { SalidaToner } from "@/pages/toners/interfaces/salidaToner";

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
  try {
    const response = await api.delete(`/toners/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getBySerial = async (serial: string) => {
  try {
    const response = await api.get(`/toners/getToner/${serial}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const createSalidaToner = async (salidaToner: SalidaToner) => {
  try {
    const response = await api.post("/toners/createSalidaToner", salidaToner);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
