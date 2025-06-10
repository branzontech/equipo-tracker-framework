import { prestamoModel } from "../../../db/models/prestamo.model.js";

export const PrestamoService = {
  getAll: async () => {
    try {
      const prestamos = await prestamoModel.findAll();
      return prestamos;
    } catch (error) {
      throw new Error("Error getting all prestamos: " + error.message);
    }
  },

  findById: async (id) => {
    try {
      const prestamo = await prestamoModel.findById(id);
      return prestamo;
    } catch (error) {
      throw new Error("Error finding prestamo by id: " + error.message);
    }
  },

  update: async (id, prestamo) => {
    try {
      const updatedPrestamo = await prestamoModel.update(id, prestamo);
      return updatedPrestamo;
    } catch (error) {
      throw new Error("Error updating prestamo: " + error.message);
    }
  },

  create: async (prestamo) => {
    try {
      const createdPrestamo = await prestamoModel.create(prestamo);
      return createdPrestamo;
    } catch (error) {
      throw new Error("Error creating prestamo: " + error.message);
    }
  },

  delete: async (id) => {
    return await prestamoModel.delete(id);
  },
};
