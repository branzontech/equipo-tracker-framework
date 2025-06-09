import { prisma } from "../../../prisma/prismaCliente.js";

export const MarcasModel = {
  findAll: async () => {
    const marcas = await prisma.marcas.findMany({
      select: {
        id_marca: true,
        nombre: true,
      },
    });
    return marcas;
  },

  findById: async (id) => {
    const id_marca = Number(id);
    const marca = await prisma.marcas.findUnique({
      where: { id_marca: id_marca },
      select: {
        id_marca: true,
        nombre: true,
      },
    });
    return marca;
  },

  create: async (marca) => {
    const marcaCreated = await prisma.marcas.create({
      data: {
        nombre: marca.nombre,
      },
    });
    return marcaCreated;
  },

  delete: async (id) => {
    const id_marca = Number(id);

    try {
      // Verificar si hay equipos que usan esta marca
      const equiposRelacionados = await prisma.equipos.findFirst({
        where: {
          marca_id: id_marca,
        },
      });

      if (equiposRelacionados) {
        throw new Error(
          "No se puede eliminar la marca porque está asociada a uno o más equipos."
        );
      }

      // Eliminar la marca si no está asociada a ningún equipo
      const deletedMarca = await prisma.marcas.delete({
        where: {
          id_marca: id_marca,
        },
      });

      return deletedMarca;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (id, marca) => {
    const id_marca = Number(id);
    try {
      const updatedMarca = await prisma.marcas.update({
        where: { id_marca },
        data: {
          nombre: marca.nombre,
        },
      });
      return updatedMarca;
    } catch (error) {
      throw new Error("Error updating marca: " + error.message);
    }
  },
};
