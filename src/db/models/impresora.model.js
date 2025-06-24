import { prisma } from "../../../prisma/prismaCliente.js";

export const impresoraModel = {
  async getAll() {
    const impresoras = await prisma.impresoras.findMany({
      select: {
        id_impresora: true,
        nombre: true,
        modelo: true,
        serial: true,
        tipo: true,
        estado: true,
        sucursales: {
          select: {
            id_sucursal: true,
            nombre: true,
          },
        },
        marcas: {
          select: {
            id_marca: true,
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

  findBySerial: async (serial) => {
    const impresora = await prisma.impresoras.findFirst({
      where: {
        serial: {
          equals: serial,
          mode: "insensitive",
        },
      },
      select: {
        id_impresora: true,
        nombre: true,
        modelo: true,
        serial: true,
        estado: true,
        sucursal_id: true,
        sucursales: {
          select: {
            id_sucursal: true,
            nombre: true,
          },
        },
        marcas: {
          select: {
            id_marca: true,
            nombre: true,
          },
        },
      },
    });
    return impresora;
  },

  async create(impresora) {
    const impresoraCreated = await prisma.impresoras.create({
      data: {
        nombre: impresora.nombre,
        modelo: impresora.modelo,
        tipo: impresora.tipo,
        serial: impresora.serial,
        estado: impresora.estado,
        marcas: {
          connect: {
            id_marca: impresora.marca_id,
          },
        },
        sucursales: {
          connect: {
            id_sucursal: impresora.sucursal_id,
          },
        },
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
