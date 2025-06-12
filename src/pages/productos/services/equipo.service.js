import { equipoModel } from "../../../db/models/equipo.model.js";

export const equipoService = {
  async create(data) {
    const equipoCreated = await equipoModel.create(data);
    return equipoCreated;
  },
  async findAll() {
    return await equipoModel.findAll();
  },
  async findById(nro_serie) {
    return await equipoModel.findById(nro_serie);
  },
  async delete_(id) {
    return await equipoModel.delete_(id);
  },
};