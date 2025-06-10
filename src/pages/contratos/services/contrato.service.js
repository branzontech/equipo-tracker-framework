import { contratoModel } from "../../../db/models/contrato.model.js";

export const contratoService = {
  async create(contrato) {
    return await contratoModel.create(contrato);
  },
  async findAll() {
    return await contratoModel.findAll();
  },
};