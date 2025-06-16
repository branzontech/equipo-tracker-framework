import { ActaModel } from "../../../db/models/acta.model.js";

export const actaService = {
  async findAll() {
    return await ActaModel.findAll();
  },
  async getInfoEquipo(nro_serie) {
    return await ActaModel.getInfoEquipo(nro_serie);
  },
  async update(id, newStatus, tipo) {
    return await ActaModel.updateStatus(id, newStatus, tipo);
  }
};
