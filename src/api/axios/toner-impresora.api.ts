import api from "./axiosConfig";

export const getTonerImpresora = async () => {
  const response = await api.get("/toner-impresora/get");
  return response.data.tonerImpresora;
};

export const getTonerImpresoraById = async (id: number) => {
  const response = await api.get(`/toner-impresora/get/${id}`);
  return response.data.tonerImpresora;
};