import { tiposModel } from "../../../../db/models/tipos.model.js";

export const tiposService = {
  async getAll() {
    try {
      const tipos = await tiposModel.findAll();
      return tipos;
    } catch (error) {
      console.error("❌ Error al obtener todos los tipos:", error);
      return error;
    }
  },
  async create(tipo) {
    try {
      const nuevoTipo = await tiposModel.create(tipo);
      return nuevoTipo;
    } catch (error) {
      console.error("❌ Error al crear el tipo:", error);
      return error;
    }
  },
};
