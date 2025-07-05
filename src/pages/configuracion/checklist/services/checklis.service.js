import { checklistModel } from "../../../../db/models/checklist.model.js";

export const checklistService = {
  async createChecklist(data) {
    return await checklistModel.createChecklist(data);
  },
  async getChecklist() {
    return await checklistModel.get();
  },
};