import { prisma } from "../../../prisma/prismaCliente.js";

export const impresoraModel = {
  async getAll() {
    const impresoras = await prisma.impresoras.findMany({
      select: {
        id_impresora: true,
        nombre: true,
        modelo: true,
        sucursal_id: true,
        sucursales: {
          select: {
            id_sucursal: true,
            nombre: true,
          },
        },
      },
    });
    return impresoras;
  },
  async getById(id) {
    const impresora = await prisma.impresoras.findUnique({
      where: {
        id,
      },
    });
    return impresora;
  },
  async create(impresora) {
    const impresoraCreated = await prisma.impresoras.create({
      data: {
        nombre: impresora.nombre,
        modelo: impresora.modelo,
        sucursal_id: impresora.sucursal_id,
      },
    });
    return impresoraCreated;
  },
  async update(impresora) {
    const impresoraUpdated = await prisma.impresoras.update({
      where: {
        id: impresora.id,
      },
      data: impresora,
    });
    return impresoraUpdated;
  },
  async delete(id) {
    const impresoraDeleted = await prisma.impresoras.delete({
      where: {
        id,
      },
    });
    return impresoraDeleted;
  },
};
