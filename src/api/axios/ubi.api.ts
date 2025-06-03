import { Ubicacion } from "@/pages/configuracion/maestros/interfaces/ubicaciones";
import api from "./axiosConfig";

export const getUbicaciones = async () => {
  const response = await api.get("/ubicaciones/get");
  return response.data.ubicaciones;
};

export const registerUbicacion = async (ubicacion: Ubicacion) => {
  const response = await api.post("/ubicaciones/create", ubicacion);
  return response.data;
};

export const deleteUbicacion = async (id: number) => {
  const response = await api.delete(`/ubicaciones/delete/${id}`);
  return response.data;
};
