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

  create: async (categoria) => {
    const categoriaCreated = await prisma.categorias.create({
      data: {
        nombre: categoria.nombre,
      },
    });
    return categoriaCreated;
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
