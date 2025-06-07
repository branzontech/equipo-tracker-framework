import { MarcasModel } from "../../../../db/models/marcas.model.js";

export const MarcasService = {
  getAll: async () => {
    try {
      const marcas = await MarcasModel.findAll();
      return marcas;
    } catch (error) {
      throw new Error("Error getting all marcas: " + error.message);
    }
  },

  findById: async (id) => {
    try {
      const marca = await MarcasModel.findById(id);
      return marca;
    } catch (error) {
      throw new Error("Error finding marca by id: " + error.message);
    }
  },

  update: async (id, marca) => {
    try {
      const updatedMarca = await MarcasModel.update(id, marca);
      return updatedMarca;
    } catch (error) {
      throw new Error("Error updating marca: " + error.message);
    }
  },

  create: async (marca) => {
    try {
      const createdMarca = await MarcasModel.create(marca);
      return createdMarca;
    } catch (error) {
      throw new Error("Error creating marca: " + error.message);
    }
  },

  delete: async (id) => {
    try {
      const deletedMarca = await MarcasModel.delete(id);
      return deletedMarca;
    } catch (error) {
      throw new Error("Error deleting marca: " + error.message);
    }
  },
};
