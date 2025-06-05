import { prisma } from "../../../prisma/prismaCliente.js";

export const UserModel = {
  findAll: async () => {
    const users = await prisma.usuarios.findMany({
      select: {
        id_usuario: true,
        nombre: true,
        email: true,
        rol: true,
        activo: true,
        sede_id: true,
        sedes: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
      },
    });
    return users;
  },
};
