import { Prestamo } from "@/pages/productos/interfaces/prestamo";
import api from "./axiosConfig";

export const create = async (prestamo: Prestamo) => {
  try {
    const response = await api.post("/prestamos/create", prestamo);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message);
  }
};

export const getAll = async () => {
  try {
    const response = await api.get("/prestamos/get");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message);
  }
};
