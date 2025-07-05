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
