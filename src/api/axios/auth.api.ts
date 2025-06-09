import api from "./axiosConfig";

export const loginUser = async (nombre: string, contraseña: string) => {
  try {
    const response = await api.post("/auth/login", { nombre, contraseña });
    return response.data;
  } catch (error) {
    console.error("Error de login:", error);
    throw new Error(error.response?.data?.message);
  }
};
