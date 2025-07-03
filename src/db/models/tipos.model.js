import { prisma } from "../../../prisma/prismaCliente.js";

export const tiposModel = {
  findAll: async () => {
    const tipos = await prisma.tipos.findMany({
      select: {
        id_tipo: true,
        nombre_tipo: true,
        estado: true,
      },
    });
    return tipos;
  },
  findById: async (id) => {
    const id_tipo = Number(id);
    try {
      const tipo = await prisma.tipos.findUnique({
        where: { id_tipo: id_tipo },
        select: {
          id_tipo: true,
          nombre_tipo: true,
          estado: true,
        },
      });
      return tipo;
    } catch (error) {
      console.error("❌ Error al obtener el tipo:", error);
      return error;
    }
  },
  create: async (tipo) => {
    try {
      const nuevaTipo = await prisma.tipos.create({
        data: {
          nombre_tipo: tipo.nombre_tipo,
          estado: tipo.estado,
        },
      });
      return nuevaTipo;
    } catch (error) {
      console.error("❌ Error al crear el tipo:", error);
      return error;
    }
  },
  update: async (id, tipo) => {
    const id_tipo = Number(id);
    try {
      const updatedTipo = await prisma.tipos.update({
        where: { id_tipo },
        data: {
          nombre_tipo: tipo.nombre_tipo,
          estado: tipo.estado,
        },
      });
      return updatedTipo;
    } catch (error) {
      console.error("❌ Error al actualizar el tipo:", error);
      return error;
    }
  },
  delete: async (id) => {
    const id_tipo = Number(id);
    try {
      const deletedTipo = await prisma.tipos.update({
        where: {
          id_tipo: id_tipo,
        },
        data: {
          estado: "Fuera de servicio",
        },
      });
      return deletedTipo;
    } catch (error) {
      console.error("❌ Error al eliminar el tipo:", error);
      return error;
    }
  },
};
