import { Mantenimiento } from "@/pages/mantenimientos/interfaces/mantenimiento";
import api from "./axiosConfig";
import { ChecklistRespuestaData } from "@/pages/configuracion/checklist/interface/checklist";

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

export const actualizarProgreso = async (id: number, progreso: number) => {
  try {
    const response = await api.put(
      `/mantenimientos/actualizar-progreso/${id}`,
      {
        progreso: progreso,
      }
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const saveResponse = async (data: ChecklistRespuestaData) => {
  try {
    const response = await api.put(
      `/mantenimientos/save-response/${data.mantenimientoId}`,
      {
        plantillaId: data.plantillaId,
        tecnicoId: data.tecnicoId,
        respuestas: data.respuestas,
        calificacion: data.calificacion,
        observaciones: data.observaciones,
        fechaRealizacion: data.fechaRealizacion,
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error al guardar el response:", error);
    throw new Error(
      error?.response?.data?.message || "Error al guardar el response"
    );
  }
};

export const getCheckListResponses = async (id: string) => {
  try {
    const response = await api.get(
      `/mantenimientos/get-checklist-responses/${id}`
    );
    return response.data;
  } catch (error) {
    throw new Error(error?.response?.data?.message);
  }
};

export const finalizeChecklistResponse = async (data: ChecklistRespuestaData) => {
  try {
    const response = await api.put(
      `/mantenimientos/finalize-checklist-response/${data.mantenimientoId}`,
      {
        observaciones: data.observaciones,
        calificacion: data.calificacion,
        fechaRealizacion: data.fechaRealizacion,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error al guardar el response:", error);
    throw new Error(
      error?.response?.data?.message || "Error al guardar el response"
    );
  }
};