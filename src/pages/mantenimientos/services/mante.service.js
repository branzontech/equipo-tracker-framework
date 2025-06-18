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
};