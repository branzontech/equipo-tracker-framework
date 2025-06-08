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
      },
    });
    return toner;
  },
  async getById(id) {
    const toner = await prisma.toner.findUnique({
      where: {
        id,
      },
    });
    return toner;
  },
  async create(toner) {
    console.log(toner);
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
    const tonerUpdated = await prisma.toner.update({
      where: {
        id: toner.id,
      },
      data: toner,
    });
    return tonerUpdated;
  },
  async delete(id) {
    const tonerDeleted = await prisma.toner.delete({
      where: {
        id,
      },
    });
    return tonerDeleted;
  },
};
