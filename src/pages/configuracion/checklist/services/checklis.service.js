import { checklistModel } from "../../../../db/models/checklist.model.js";

export const checklistService = {
  async createChecklist(data) {
    return await checklistModel.createChecklist(data);
  },
  async getChecklist() {
    return await checklistModel.get();
  },
  async getChecklistById(id) {
    return await checklistModel.getById(id);
  },
  async updateChecklist(id, data) {
    return await checklistModel.updateChecklist(id, data);
  },
  async disableChecklist(id) {
    return await checklistModel.disableChecklist(id);
  },
  async enableChecklist(id) {
    return await checklistModel.enableChecklist(id);
  },
};