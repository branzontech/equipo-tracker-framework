import { equipoModel } from "../../../db/models/equipo.model.js";

export const equipoService = {
  async create(data) {
    return await equipoModel.create(data);
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