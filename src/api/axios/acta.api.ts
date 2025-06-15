import api from "./axiosConfig";

export const get = async () => {
  const { data } = await api.get("/actas/get");
  return data;
};

export const updateStatus = async (id, newStatus, tipo) => {
  const { data } = await api.post("/actas/updateStatus", {
    id,
    newStatus,
    tipo,
  });
  return data;
};
