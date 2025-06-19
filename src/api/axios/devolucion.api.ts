import { Devolucion } from "@/pages/productos/interfaces/devoluciones";
import api from "./axiosConfig";

export const getDevoluciones = async () => {
  try {
    const response = await api.get("/devoluciones/get");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getEquiposEnMovimiento = async () => {
  try {
    const response = await api.get("/devoluciones/getEquipos");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const create = async (devolucion: Devolucion) => {
  try {
    const response = await api.post("/devoluciones/create", devolucion);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};