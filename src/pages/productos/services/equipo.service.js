import { equipoModel } from "../../../db/models/equipo.model.js";

export const equipoService = {
  async create(data) {
    return await equipoModel.create(data);
  },
  async findAll() {
    return await equipoModel.findAll();
  },
};