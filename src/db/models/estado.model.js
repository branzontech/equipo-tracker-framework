import { prisma } from "../../../prisma/prismaCliente.js";

export const estadoModel = {
  findAll: async () => {
    const estados = await prisma.estados.findMany({
      select: {
        id_estado: true,
        nombre_estado: true,
      },
    });
    return estados;
  },
  create: async (estado) => {
    try {
      const nuevoEstado = await prisma.estados.create({
        data: {
          nombre_estado: estado.nombre_estado,
        },
      });
      return nuevoEstado;
    } catch (error) {
      console.error("❌ Error al crear el estado:", error);
      return error;
    }
  },
};
