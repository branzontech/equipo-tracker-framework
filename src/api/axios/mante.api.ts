import { Mantenimiento } from "@/pages/mantenimientos/interfaces/mantenimiento";
import api from "./axiosConfig";

export const getAll = async () => {
  try {
    const response = await api.get("/mantenimientos/get");
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const getById = async (id: string) => {
  const response = await api.get(`/mantenimientos/get/${id}`);
  return response.data;
};

export const create = async (data: Mantenimiento) => {
  try {
    const response = await api.post("/mantenimientos/create", data);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const updateStatus = async (id: number, status: string) => {
  try {
    const response = await api.put(`/mantenimientos/update/${id}`, {
      status: status,
    });
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const uploadFiles = async (id: number, files: File[]) => {
  try {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await api.post(`/mantenimientos/upload/${id}`, formData);

    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const getFiles = async () => {
  try {
    const response = await api.get(`/mantenimientos/files`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const delete_ = async (id: string) => {
  try {
    const response = await api.delete(`/mantenimientos/delete/${id}`);
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};
