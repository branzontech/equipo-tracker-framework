import { prisma } from "../../../prisma/prismaCliente.js";

export const PerifericoModel = {
  findAll: async () => {
    const periferico = await prisma.perifericos.findMany({
      select: {
        id_periferico: true,
        nombre: true,
        estado: true,
        tipo: true,
        equipo_asociado_id: true,
        equipos: {
          select: {
            id_equipo: true,
            nombre_equipo: true,
          },
        },
      },
    });
    return periferico;
  },

  create: async (periferico) => {
    const perifericoCreated = await prisma.perifericos.create({
      data: {
        nombre: periferico.nombre,
        estado: periferico.estado,
        tipo: periferico.tipo,
        equipo_asociado_id: periferico.equipo_asociado_id,
      },
    });
    return perifericoCreated;
  },

  delete: async (id) => {
    const id_periferico = Number(id);
    try {
      const deletedPeriferico = await prisma.perifericos.delete({
        where: {
          id_periferico: id_periferico,
        },
      });
      return deletedPeriferico;
    } catch (error) {
      throw new Error("Error deleting periferico: " + error.message);
    }
  },
};
