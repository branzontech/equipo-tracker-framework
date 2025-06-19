import api from "./axiosConfig";

export const getUsers = async () => {
    const response = await api.get("/users/get");
    return response.data.usuarios;
};

export const getUserByName = async (name: string) => {
    const response = await api.get(`/users/get/${name}`);
    return response.data.usuario;
};