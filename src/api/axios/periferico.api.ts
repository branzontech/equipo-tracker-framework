import { Perifericos } from "@/pages/configuracion/maestros/interfaces/periferico";
import api from "./axiosConfig";

export const getPerifericos = async () => {
  try {
    const response = await api.get("/perifericos/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching perifericos:", error);
    throw error;
  }
};

export const getPerifericoById = async (id: number) => {
  try {
    const response = await api.get(`/perifericos/get/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching periferico by id:", error);
    throw error;
  }
};

export const getPerifericoBySerial = async (serial: string) => {
  try {
    const response = await api.get(`/perifericos/getPeriferico/${serial}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching periferico by serial:", error);
    throw error;
  }
};

export const updatePeriferico = async (id: number, periferico: Perifericos) => {
  try {
    const response = await api.put(`/perifericos/update/${id}`, periferico);
    return response.data;
  } catch (error) {
    console.error("Error updating periferico:", error);
    throw error;
  }
};

export const createPeriferico = async (periferico: Perifericos) => {
  try {
    const response = await api.post("/perifericos/create", periferico);
    return response.data;
  } catch (error) {
    console.error("Error creating periferico:", error);
    throw error;
  }
};

export const deletePeriferico = async (id: number) => {
  try {
    const response = await api.delete(`/perifericos/delete${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting periferico:", error);
    throw error;
  }
};
