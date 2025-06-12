import { bajaModel } from "../../../db/models/baja.model.js";

export const bajaService = {
  async findAll() {
    return await bajaModel.findAll();
  },
  async create(baja) {
    return await bajaModel.create(baja);
  },
};
