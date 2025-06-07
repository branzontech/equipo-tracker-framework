import { Sucursal } from "@/pages/configuracion/maestros/interfaces/sucursales";
import api from "./axiosConfig";

export const getsucursales = async () => {
  const response = await api.get("/sucursales/get");
  return response.data.sucursales;
};

export const getSucursalById = async (id: number) => {
  const response = await api.get(`/sucursales/get/${id}`);
  return response.data.sucursal;
};

export const updateSucursal = async (id: number, sucursal: Sucursal) => {
  const response = await api.put(`/sucursales/update/${id}`, sucursal);
  return response.data;
};

export const registerSucursal = async (sucursal: Sucursal) => {
  const response = await api.post("/sucursales/create", sucursal);
  return response.data;
};

export const deleteSucursal = async (id: number) => {
  const response = await api.delete(`/sucursales/delete/${id}`);
  return response.data;
};
