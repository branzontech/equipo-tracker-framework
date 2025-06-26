import { prisma } from "../../../prisma/prismaCliente.js";

export const tonersModel = {
  async getAll() {
    const toner = await prisma.toner.findMany({
      select: {
        id_toner: true,
        modelo: true,
        color: true,
        cantidad: true,
        stock_actual: true,
        stock_minimo_alerta: true,
        estado: true,
      },
    });
    return toner;
  },
  async getById(id) {
    const tonerId = Number(id);
    const toner = await prisma.toner.findUnique({
      where: {
        id_toner: tonerId,
      },
      include: {
        toner_impresora: {
          include: {
            impresoras: true,
          },
        },
      },
    });
    return toner;
  },
  async create(toner) {
    const tonerCreated = await prisma.toner.create({
      data: {
        modelo: toner.modelo,
        color: toner.color,
        cantidad: toner.cantidad,
        stock_actual: toner.stock_actual,
        stock_minimo_alerta: toner.stock_minimo_alerta,

        // Relación con impresoras (toner_impresora)
        toner_impresora: {
          create: toner.impresoras.map((id) => ({
            impresoras: { connect: { id_impresora: id } },
          })),
        },
      },
      include: {
        toner_impresora: true,
      },
    });

    return tonerCreated;
  },
  async update(toner) {
    try {
      const tonerId = toner.id_toner;
      const nuevaImpresoraId = toner.toner_impresora[0]?.impresora_id;

      // 1. Eliminar relaciones anteriores del toner
      await prisma.toner_impresora.deleteMany({
        where: {
          toner_id: tonerId,
        },
      });

      // 2. Actualizar el toner e insertar la nueva relación
      const tonerUpdated = await prisma.toner.update({
        where: {
          id_toner: tonerId,
        },
        data: {
          estado: toner.estado,
          modelo: toner.modelo,
          color: toner.color,
          cantidad: toner.cantidad,
          stock_actual: toner.stock_actual,
          stock_minimo_alerta: toner.stock_minimo_alerta,
          toner_impresora: {
            create: {
              impresora_id: nuevaImpresoraId,
            },
          },
        },
      });

      return tonerUpdated;
    } catch (error) {
      console.error("Error al actualizar el toner:", error);
      throw new Error("Error al actualizar el toner: " + error.message);
    }
  },
  async delete(id) {
    const tonerId = Number(id);
    try {
      const tonerDeleted = await prisma.toner.update({
        where: {
          id_toner: tonerId,
        },
        data: {
          estado: "Fuera de servicio",
        },
      });
      return tonerDeleted;
    } catch (error) {
      console.error("Error al eliminar el toner:", error);
      throw new Error("Error al eliminar el toner: " + error.message);
    }
  },
};
