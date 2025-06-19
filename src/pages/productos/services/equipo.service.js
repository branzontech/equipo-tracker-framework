import { equipoModel } from "../../../db/models/equipo.model.js";

export const equipoService = {
  async create(data) {
    const equipoCreated = await equipoModel.create(data);
    return equipoCreated;
  },
  async update(data) {
    const equipoUpdated = await equipoModel.update(data);
    return equipoUpdated;
  },
  async findAll() {
    return await equipoModel.findAll();
  },
  async findById(nro_serie) {
    return await equipoModel.findById(nro_serie);
  },
  async delete(id) {
    return await equipoModel.delete_(id);
  },
  async getTrazabilidadByEquipoId(id_equipo) {
    return await equipoModel.getTrazabilidadByEquipoId(id_equipo);
  },
};