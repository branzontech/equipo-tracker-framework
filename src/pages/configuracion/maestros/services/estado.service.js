import { estadoModel } from "../../../../db/models/estado.model.js";

export const estadoService = {
  async getAll() {
    try {
      const estados = await estadoModel.findAll();
      return estados;
    } catch (error) {
      console.error("❌ Error al obtener todos los estados:", error);
      return error;
    }
  },
  async create(estado) {
    try {
      const nuevoEstado = await estadoModel.create(estado);
      return nuevoEstado;
    } catch (error) {
      console.error("❌ Error al crear el estado:", error);
      return error;
    }
  },
};