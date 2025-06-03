import { CategoriaModel } from "../../../../db/models/categoria.model.js";

export const CategoriaService = {
  getAll: async () => {
    try {
      const categorias = await CategoriaModel.findAll();
      return categorias;
    } catch (error) {
      throw new Error("Error getting all categorias: " + error.message);
    }
  },

  create: async (categoria) => {
    try {
      const createdCategoria = await CategoriaModel.create(categoria);
      return createdCategoria;
    } catch (error) {
      throw new Error("Error creating categoria: " + error.message);
    }
  },

  delete: async (id) => {
    try {
      const deletedCategoria = await CategoriaModel.delete(id);
      return deletedCategoria;
    } catch (error) {
      throw new Error("Error deleting categoria: " + error.message);
    }
  },
};
