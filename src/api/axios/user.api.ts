import api from "./axiosConfig";

export const getUsers = async () => {
    const response = await api.get("/users/get");
    return response.data.usuarios;
};