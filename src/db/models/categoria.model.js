import { prisma } from "../../../prisma/prismaCliente.js";

export const CategoriaModel = {
  findAll: async () => {
    const categorias = await prisma.categorias.findMany({
      select: {
        id_categoria: true,
        nombre: true,
        estado: true,
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
        estado: true,
      },
    });
    return categoria;
  },

  create: async (categoria) => {
    const categoriaCreated = await prisma.categorias.create({
      data: {
        nombre: categoria.nombre,
        estado: categoria.estado,
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
          estado: categoria.estado,
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
      // verificar si hay equipos asociados a esta categoria
      const equiposRelacionados = await prisma.equipos.findMany({
        where: {
          categoria_id: id_categoria,
        },
      });

      if (equiposRelacionados.length > 0) {
        throw new Error(
          "No se puede eliminar la categoria porque está asociada a uno o más equipos."
        );
      }
      const deletedCategoria = await prisma.categorias.update({
        where: {
          id_categoria: id_categoria,
        },
        data: {
          estado: "Fuera de servicio",
        },
      });
      return deletedCategoria;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
