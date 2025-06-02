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
    // 1. Crear la sede
    const sedeCreated = await prisma.sedes.create({
      data: {
        descripcion: sede.descripcion,
        estado: sede.estado,
      },
    });

    // 2. Actualizar los usuarios para asignarles el id_sede
    if (sede.usuarios && sede.usuarios.length > 0) {
      const userIds = sede.usuarios.map((u) => u.id_usuario);

      await prisma.usuarios.updateMany({
        where: { id_usuario: { in: userIds } },
        data: { sede_id: sedeCreated.id_sede },
      });
    }

    // 3. Traer la sede con los usuarios actualizados
    const sedeWithUsers = await prisma.sedes.findUnique({
      where: { id_sede: sedeCreated.id_sede },
      include: { usuarios: true },
    });

    return sedeWithUsers;
  },
};
