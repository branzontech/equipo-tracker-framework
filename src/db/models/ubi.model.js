import { prisma } from "../../../prisma/prismaCliente.js";

export const UbiModel = {
  findAll: async () => {
    const ubicaciones = await prisma.ubicaciones.findMany({
      select: {
        id_ubicacion: true,
        nombre: true,
        tipo: true,
        sedes: {
          select: {
            id_sede: true,
            descripcion: true,
            estado: true,
          },
        },
      },
    });
    return ubicaciones;
  },

  create: async (ubicacion) => {
    try {
      const newUbi = await prisma.ubicaciones.create({
        data: {
          nombre: ubicacion.nombre,
          sede_id: ubicacion.sede_id,
          tipo: ubicacion.tipo,
        },
      });
      return newUbi;
    } catch (error) {
      throw new Error("Error creating ubicacion: " + error.message);
    }
  },
};
