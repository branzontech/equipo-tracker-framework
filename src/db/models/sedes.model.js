import { prisma } from "../../../prisma/prismaCliente.js";

export const SedesModel = {
  findAll: async () => {
    try {
      const sedes = await prisma.sedes.findMany({
        select: {
          nombre: true,
          estado: true,
          id_sede: true,
          usuario_sede: {
            select: {
              usuarios: {
                select: {
                  id_usuario: true,
                  nombre: true,
                },
              },
              sedes: {
                select: {
                  id_sede: true,
                  nombre: true,
                  sucursales: {
                    select: {
                      id_sucursal: true,
                      nombre: true,
                    },
                  },
                },
              },
            },
          },
        },
      });
      return sedes;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },

  findById: async (id) => {
    const id_Sede = Number(id);
    const sede = await prisma.sedes.findUnique({
      where: { id_sede: id_Sede },
      include: {
        usuario_sede: {
          include: {
            usuarios: true,
          },
        },
      },
    });
    return sede;
  },

  create: async (sede) => {
    const sedeCreated = await prisma.sedes.create({
      data: {
        nombre: sede.nombre,
        estado: sede.estado,
      },
    });

    // Relación correcta: usuario_sede
    if (sede.usuario_sede && sede.usuario_sede.length > 0) {
      const relations = sede.usuario_sede.map((u) => ({
        id_usuario: u.usuarios.id_usuario,
        id_sede: sedeCreated.id_sede,
      }));

      await prisma.usuario_sede.createMany({
        data: relations,
        skipDuplicates: true,
      });
    }

    const sedeWithUsers = await prisma.sedes.findUnique({
      where: { id_sede: sedeCreated.id_sede },
      include: {
        usuario_sede: {
          include: {
            usuarios: true,
          },
        },
      },
    });

    return sedeWithUsers;
  },

  delete: async (id) => {
    const id_sede = Number(id);
    try {
      const sucursales = await prisma.sucursales.findMany({
        where: {
          sede_id: id_sede,
        },
      });

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

      if (sucursales.length > 0) {
        await prisma.sucursales.deleteMany({
          where: {
            sede_id: id_sede,
          },
        });
      }

      await prisma.usuario_sede.deleteMany({
        where: {
          id_sede: id_sede,
        },
      });

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
      const updatedSede = await prisma.sedes.update({
        where: { id_sede },
        data: {
          nombre: sede.nombre,
          estado: sede.estado,
        },
      });

      if (sede.usuarios) {
        await prisma.usuario_sede.deleteMany({
          where: { id_sede },
        });

        const relations = sede.usuarios.map((u) => ({
          id_usuario: u.id_usuario,
          id_sede,
        }));

        await prisma.usuario_sede.createMany({
          data: relations,
          skipDuplicates: true,
        });
      }

      return updatedSede;
    } catch (error) {
      throw new Error("Error updating sede: " + error.message);
    }
  },
};
