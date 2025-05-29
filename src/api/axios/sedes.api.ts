import api from "./axiosConfig";

export const getSedes = async () => {
    const response = await api.get("/sedes/get");
    return response.data.sedes;
};
