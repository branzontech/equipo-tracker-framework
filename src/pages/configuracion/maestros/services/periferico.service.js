import { PerifericoModel } from "../../../../db/models/periferico.models.js";

export const perifericoService = {
  async findAll() {
    return await PerifericoModel.findAll();
  },
  async findById(id) {
    return await PerifericoModel.findById(id);
  },
  async update(id, periferico) {
    return await PerifericoModel.update(id, periferico);
  },
  async create(periferico) {
    return await PerifericoModel.create(periferico);
  },
  async delete(id) {
    return await PerifericoModel.delete(id);
  },
};