import { prisma } from "../../../prisma/prismaCliente.js";

export const SedesModel = {
  findAll: async () => {
    const sedes = await prisma.sedes.findMany();
    return sedes;
  },
};
