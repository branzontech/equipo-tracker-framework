import api from "./axiosConfig";

export const loginUser = async (nombre: string, contraseña: string) => {
  const response = await api.post("/login", { nombre, contraseña });
  return response.data; 
};
