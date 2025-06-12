import { Traslado } from "@/pages/productos/interfaces/traslados";
import api from "./axiosConfig";

export const getAll = async () => {
  const response = await api.get("/traslados/get");
  return response.data;
};

export const create = async (traslado: Traslado) => {
  const response = await api.post("/traslados/create", traslado);
  return response.data;
};
