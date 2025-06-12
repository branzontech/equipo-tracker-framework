import { Baja } from "@/pages/productos/interfaces/bajas";
import api from "./axiosConfig";

export const getAllBajas = async () => {
  const res = await api.get("/bajas/get");
  return res.data;
};

export const createBaja = async (baja: Baja) => {
  const res = await api.post("/bajas/create", baja);
  return res.data;
};
