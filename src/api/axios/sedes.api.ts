import { Sede } from "@/pages/configuracion/maestros/interfaces/sedes";
import api from "./axiosConfig";

export const getSedes = async () => {
    const response = await api.get("/sedes/get");
    return response.data.sedes;
};

export const createSede = async (sede: Sede) => {
    const response = await api.post("/sedes/create", sede);
    return response.data;
};
