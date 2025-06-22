import { prisma } from "../../../prisma/prismaCliente.js";

export const SedesModel = {
  findAll: async () => {
    const sedes = await prisma.sedes.findMany({
      select: {
        id_sede: true,
        nombre: true,
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

  findById: async (id) => {
    const id_Sede = Number(id);
    const sede = await prisma.sedes.findUnique({
      where: { id_sede: id_Sede },
      include: { usuarios: true },
    });
    return sede;
  },

  create: async (sede) => {
    // 1. Crear la sede
    const sedeCreated = await prisma.sedes.create({
      data: {
        nombre: sede.nombre,
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

  delete: async (id) => {
    const id_sede = Number(id);
    try {
      // 1. Verificar si hay ubicaciones
      const sucursales = await prisma.sucursales.findMany({
        where: {
          sede_id: id_sede,
        },
      });

      // 2. Verificar vinculaciones en equipos o impresoras para cada sucursal
      for (const sucursal of sucursales) {
        const tieneEquipos = await prisma.equipos.findFirst({
          where: { sucursal_id: sucursal.id_sucursal },
        });
        if (tieneEquipos) {
          throw new Error(
            `No se puede eliminar porque la sucursal "${sucursal.nombre}" tiene equipos asociados.`
          );
        }

        const tieneImpresoras = await prisma.impresoras.findFirst({
          where: { sucursal_id: sucursal.id_sucursal },
        });
        if (tieneImpresoras) {
          throw new Error(
            `No se puede eliminar porque la sucursal "${sucursal.nombre}" tiene impresoras asociadas.`
          );
        }
      }

      // 3. Si no hay vinculaciones, eliminar todas las sucursales
      if (sucursales.length > 0) {
        await prisma.sucursales.deleteMany({
          where: {
            sede_id: id_sede,
          },
        });
      }

      // 4. Unlink all users from the sede
      await prisma.usuarios.updateMany({
        where: {
          sede_id: id_sede,
        },
        data: {
          sede_id: null,
        },
      });

      // 5. Delete the sede
      const deletedSede = await prisma.sedes.delete({
        where: {
          id_sede: id_sede,
        },
      });
      return deletedSede;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (id, sede) => {
    const id_sede = Number(id);
    try {
      // 1. Actualizar nombre y estado
      const updatedSede = await prisma.sedes.update({
        where: { id_sede },
        data: {
          nombre: sede.nombre,
          estado: sede.estado,
        },
      });

      // 2. Actualizar usuarios asignados (si se enviaron)
      if (sede.usuarios) {
        const newUserIds = sede.usuarios.map((u) => u.id_usuario);

        // 2a. Obtener usuarios actuales de esta sede
        const currentUsers = await prisma.usuarios.findMany({
          where: { sede_id: id_sede },
          select: { id_usuario: true },
        });

        const currentUserIds = currentUsers.map((u) => u.id_usuario);

        // 2b. Calcular usuarios a desasignar
        const usersToUnlink = currentUserIds.filter(
          (id) => !newUserIds.includes(id)
        );

        // 2c. Calcular usuarios a asignar (por si vinieran de otra sede o sin sede)
        const usersToLink = newUserIds;

        // 2d. Desasignar usuarios que ya no deben estar en esta sede
        if (usersToUnlink.length > 0) {
          await prisma.usuarios.updateMany({
            where: { id_usuario: { in: usersToUnlink } },
            data: { sede_id: null },
          });
        }

        // 2e. Asignar usuarios seleccionados (aunque ya estén)
        if (usersToLink.length > 0) {
          await prisma.usuarios.updateMany({
            where: { id_usuario: { in: usersToLink } },
            data: { sede_id: id_sede },
          });
        }
      }

      return updatedSede;
    } catch (error) {
      throw new Error("Error updating sede: " + error.message);
    }
  },
};
