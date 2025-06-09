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

  findById: async (id) => {
    try {
      const categoria = await CategoriaModel.findById(id);
      return categoria;
    } catch (error) {
      throw new Error("Error finding categoria by id: " + error.message);
    }
  },

  update: async (id, categoria) => {
    try {
      const updatedCategoria = await CategoriaModel.update(id, categoria);
      return updatedCategoria;
    } catch (error) {
      throw new Error("Error updating categoria: " + error.message);
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
    return await CategoriaModel.delete(id);
  },
};
