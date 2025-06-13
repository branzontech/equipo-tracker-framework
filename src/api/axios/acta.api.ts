import api from "./axiosConfig";

export const get = async () => {
  const { data } = await api.get("/actas/get");
  return data;
};