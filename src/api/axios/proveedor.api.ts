import { Proveedor } from "@/pages/configuracion/maestros/interfaces/proveedor";
import api from "./axiosConfig";

export const getAllProveedores = async () => {
  const response = await api.get("/proveedores/get");
  return response.data;
};

export const createProveedor = async (data: Proveedor) => {
  try {
    const response = await api.post("/proveedores/create", data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getProveedorByName = async (name: string) => {
  const response = await api.get(`/proveedores/get/${name}`);
  return response.data;
};
