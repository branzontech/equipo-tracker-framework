import { prisma } from "../../../prisma/prismaCliente.js";

export const CategoriaModel = {
  findAll: async () => {
    const categorias = await prisma.categorias.findMany({
      select: {
        id_categoria: true,
        nombre: true,
      },
    });
    return categorias;
  },

  findById: async (id) => {
    const id_categoria = Number(id);
    const categoria = await prisma.categorias.findUnique({
      where: { id_categoria: id_categoria },
      select: {
        id_categoria: true,
        nombre: true,
      },
    });
    return categoria;
  },

  create: async (categoria) => {
    const categoriaCreated = await prisma.categorias.create({
      data: {
        nombre: categoria.nombre,
      },
    });
    return categoriaCreated;
  },

  update: async (id, categoria) => {
    const id_categoria = Number(id);
    try {
      const updatedCategoria = await prisma.categorias.update({
        where: { id_categoria },
        data: {
          nombre: categoria.nombre,
        },
      });
      return updatedCategoria;
    } catch (error) {
      throw new Error("Error updating categoria: " + error.message);
    }
  },

  delete: async (id) => {
    const id_categoria = Number(id);
    try {
      const deletedCategoria = await prisma.categorias.delete({
        where: {
          id_categoria: id_categoria,
        },
      });
      return deletedCategoria;
    } catch (error) {
      throw new Error("Error deleting categoria: " + error.message);
    }
  },
};
