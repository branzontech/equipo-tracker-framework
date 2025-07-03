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
  async getById(id) {
    try {
      const tipo = await tiposModel.findById(id);
      return tipo;
    } catch (error) {
      console.error("❌ Error al obtener el tipo:", error);
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
  async update(id, tipo) {
    try {
      const updatedTipo = await tiposModel.update(id, tipo);
      return updatedTipo;
    } catch (error) {
      console.error("❌ Error al actualizar el tipo:", error);
      return error;
    }
  },
  async delete(id) {
    try {
      const deletedTipo = await tiposModel.delete(id);
      return deletedTipo;
    } catch (error) {
      console.error("❌ Error al eliminar el tipo:", error);
      return error;
    }
  },
};
