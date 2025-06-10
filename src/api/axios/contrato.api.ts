import { Contrato } from "@/pages/contratos/interfaces/contrato";
import api from "./axiosConfig";

export const create = async (contrato: Contrato) => {
  try {
    const response = await api.post("/contrato/create", contrato);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message);
  }
};

export const getAll = async () => {
  try {
    const response = await api.get("/contrato/get");
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data.message);
  }
};
