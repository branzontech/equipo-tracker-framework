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
        firma: true,
        sedes: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
      },
    });

    // Convierte firma a base64 si es Uint8Array
    const usersWithFirmaBase64 = users.map((user) => ({
      ...user,
      firma: user.firma
        ? `data:image/png;base64,${Buffer.from(user.firma).toString("base64")}`
        : null,
    }));

    return usersWithFirmaBase64;
  },
};
