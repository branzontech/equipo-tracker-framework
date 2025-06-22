import { prisma } from "../../../prisma/prismaCliente.js";

export const tiposModel = {
  findAll: async () => {
    const tipos = await prisma.tipos.findMany({
      select: {
        id_tipo: true,
        nombre_tipo: true,
      },
    });
    return tipos;
  },
  create: async (tipo) => {
    try {
      const nuevaTipo = await prisma.tipos.create({
        data: {
          nombre_tipo: tipo.nombre_tipo,
        },
      });
      return nuevaTipo;
    } catch (error) {
      console.error("❌ Error al crear el tipo:", error);
      return error;
    }
  },
};
