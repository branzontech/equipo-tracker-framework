import { Equipo } from "@/pages/productos/interfaces/equipo";
import api from "./axiosConfig";

export const getEquipos = async () => {
  try {
    const response = await api.get("/equipos/get");
    return response.data;
  } catch (error) {
    console.error("Error fetching equipos:", error);
    throw error;
  }
};

export const createEquipo = async (equipo: Equipo) => {
  try {
    const response = await api.post("/equipos/create", equipo);
    return response.data;
  } catch (error) {
    console.error("Error creating equipo:", error);
    throw error;
  }
};
