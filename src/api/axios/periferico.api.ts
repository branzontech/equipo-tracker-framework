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
    const response = await api.delete(`/perifericos/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting periferico:", error);
    throw error;
  }
};