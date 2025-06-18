import api from "./axiosConfig";

export const get = async () => {
  const { data } = await api.get("/actas/get");
  return data;
};

export const getInfoEquipo = async (nro_serie) => {
  const { data } = await api.get(`/actas/getEquipo/${nro_serie}`);
  return data;
};

export const updateStatus = async (id, newStatus, tipo, acta_equipos) => {
  const { data } = await api.post("/actas/updateStatus", {
    id,
    newStatus,
    tipo,
    acta_equipos
  });
  return data;
};
