import { prisma } from "../../../prisma/prismaCliente.js";

export const SedesModel = {
  findAll: async () => {
    const sedes = await prisma.sedes.findMany({
      select: {
        id_sede: true,
        descripcion: true,
        estado: true,
        usuarios: {
          select: {
            id_usuario: true,
            nombre: true,
          },
        },
      },
    });
    return sedes;
  },

  create: async (sede) => {
    const sedeCreated = await prisma.sedes.create({
      data: sede,
    });
    return sedeCreated;
  },
};
