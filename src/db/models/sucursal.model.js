import { prisma } from "../../../prisma/prismaCliente.js";

export const sucursalesModel = {
  findAll: async () => {
    const Sucursales = await prisma.sucursales.findMany({
      select: {
        id_sucursal: true,
        nombre: true,
        tipo: true,
        estado: true,
        area: true,
        sedes: {
          select: {
            id_sede: true,
            nombre: true,
          },
        },
      },
    });

    return Sucursales;
  },

  findById: async (id) => {
    const id_sucursal = Number(id);
    const sucursal = await prisma.sucursales.findUnique({
      where: { id_sucursal: id_sucursal },
      include: { sedes: true },
    });
    return sucursal;
  },

  create: async (id_sucursal) => {
    try {
      const newUbi = await prisma.sucursales.create({
        data: {
          nombre: id_sucursal.nombre,
          estado: id_sucursal.estado,
          sede_id: id_sucursal.sede_id,
          tipo: id_sucursal.tipo,
          area: id_sucursal.area,
        },
      });
      return newUbi;
    } catch (error) {
      throw new Error("Error creating sucursal: " + error.message);
    }
  },

  delete: async (id) => {
    const id_sucursal = Number(id);
    try {
      // verificar si hay equipos asociados a esta sucursal
      const equiposRelacionados = await prisma.equipos.findMany({
        where: {
          sucursal_id: id_sucursal,
        },
      });

      if (equiposRelacionados) {
        throw new Error(
          "No se puede eliminar la sucursal porque está asociada a uno o más equipos."
        );
      }

      // verificar impresoras asociadas a esta sucursal
      const impresorasRelacionadas = await prisma.impresoras.findMany({
        where: {
          sucursal_id: id_sucursal,
        },
      });

      if (impresorasRelacionadas) {
        throw new Error(
          "No se puede eliminar la sucursal porque está asociada a una o más impresoras."
        );
      }
      const deleted = await prisma.sucursales.delete({
        where: {
          id_sucursal: id_sucursal,
        },
      });
      return deleted;
    } catch (error) {
      throw new Error(error.message);
    }
  },

  update: async (id, sucursal) => {
    const id_sucursal = Number(id);
    try {
      const updated = await prisma.sucursales.update({
        where: { id_sucursal },
        data: {
          nombre: sucursal.nombre,
          estado: sucursal.estado,
          sede_id: sucursal.sede_id,
          tipo: sucursal.tipo,
          area: sucursal.area,
        },
      });
      return updated;
    } catch (error) {
      throw new Error("Error updating sucursal: " + error.message);
    }
  },
};
