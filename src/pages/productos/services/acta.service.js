import { ActaModel } from "../../../db/models/acta.model.js";

export const actaService = {
  async findAll() {
    return await ActaModel.findAll();
  },
  async update(id, newStatus, tipo) {
    return await ActaModel.updateStatus(id, newStatus, tipo);
  }
};
