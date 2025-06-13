import { ActaModel } from "../../../db/models/acta.model.js";

export const actaService = {
  async findAll() {
    return await ActaModel.findAll();
  },
};
