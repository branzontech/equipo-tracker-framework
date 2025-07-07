import { manteModel } from "../../../db/models/mante.model.js";

export const manteService = {
  async getAll() {
    return await manteModel.getAll();
  },
  async getById(id) {
    return await manteModel.getById(id);
  },
  async create(data) {
    return await manteModel.create(data);
  },
  async updateStatus(id, status) {
    return await manteModel.updateStatus(id, status);
  },
  async uploadFiles(id, files) {
    return await manteModel.uploadFiles(id, files);
  },
  async getFiles() {
    return await manteModel.getFiles();
  },
  async delete(id) {
    return await manteModel.delete(id);
  },
  async actualizarProgreso(id, progreso) {
    return await manteModel.actualizarProgreso(id, progreso);
  },
  async saveResponse(id, respuestas) {
    return await manteModel.saveResponse(id, respuestas);
  },
  async getCheckListResponses(id) {
    return await manteModel.getCheckListResponses(id);
  },
  async finalizeChecklistResponse(data) {
    return await manteModel.finalizeChecklistResponse(data);
  },
};
