import { Checklist } from "@/pages/configuracion/checklist/interface/checklist";
import api from "./axiosConfig";

export const createChecklist = async (data: Checklist) => {
  try {
    const res = await api.post("/checklist/create", data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getChecklist = async () => {
  try {
    const res = await api.get("/checklist/get");
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const getChecklistById = async (id: number) => {
  try {
    const res = await api.get(`/checklist/get/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const updateChecklist = async (id: number, data: Checklist) => {
  try {
    const res = await api.put(`/checklist/update/${id}`, data);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const disableChecklist = async (id: number) => {
  try {
    const res = await api.put(`/checklist/disable/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};

export const enableChecklist = async (id: number) => {
  try {
    const res = await api.put(`/checklist/enable/${id}`);
    return res.data;
  } catch (error) {
    throw new Error(error.response?.data?.message);
  }
};