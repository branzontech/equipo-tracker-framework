import api from "./axiosConfig";

export const getTonerImpresora = async () => {
  const response = await api.get("/toner-impresora/get");
  return response.data.tonerImpresora;
};
