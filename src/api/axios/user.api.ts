import { Usuario } from "@/pages/configuracion/usuarios/interfaces/usuarios";
import api from "./axiosConfig";

export const getUsers = async () => {
  const response = await api.get("/users/get");
  return response.data.usuarios;
};

export const getUserByName = async (name: string) => {
  const response = await api.get(`/users/get/${name}`);
  return response.data.usuario;
};

export const createUser = async (usuario: Usuario) => {
  try {
    const response = await api.post("/users/create", usuario);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};
