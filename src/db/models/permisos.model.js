import { prisma } from "../../../prisma/prismaCliente.js";

export const permisos = {
  async getAll() {
    const permisos = await prisma.permisos.findMany({
      select: {
        id: true,
        nombre_permiso: true,
        descripcion: true,
        ruta_opcional: true,
      },
    });
    return permisos;
  },

  async asignarPermisosPerfil(perfilId, permisoIds) {
    // Borrar todos los permisos actuales de ese perfil
    await prisma.perfilpermiso.deleteMany({
      where: { perfil_id: perfilId },
    });

    // Insertar los nuevos permisos (si hay)
    if (permisoIds.length > 0) {
      const data = permisoIds.map((permisoId) => ({
        perfil_id: perfilId,
        permiso_id: permisoId,
      }));

      await prisma.perfilpermiso.createMany({ data });
    }

    return { success: true };
  },

  async getPermisosPorPerfil(perfilId) {
    const Id = Number(perfilId);

    if (!Id) {
      throw new Error("Perfil no encontrado");
    }
    const permisos = await prisma.perfilpermiso.findMany({
      where: { perfil_id: Id },
      select: {
        permisos: {
          select: {
            id: true,
            nombre_permiso: true,
            descripcion: true,
            ruta_opcional: true,
          },
        },
      },
    });

    return permisos.map((p) => p.permisos);
  },
};
