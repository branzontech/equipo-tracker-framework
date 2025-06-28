import { prisma } from "../../../prisma/prismaCliente.js";

export const impresoraModel = {
  async getAll() {
    const impresoras = await prisma.impresoras.findMany({
      where: {
        estado: {
          not: "Fuera de servicio",
        },
      },
      select: {
        id_impresora: true,
        nombre: true,
        modelo: true,
        serial: true,
        tipo: true,
        estado: true,
        marcas: true,
        sucursales: {
          include: {
            sedes: {
              select: {
                id_sede: true,
                nombre: true,
              },
            },
          },
        },
      },
    });
    return impresoras;
  },
  async getById(id) {
    const ImpreId = Number(id);
    const impresora = await prisma.impresoras.findUnique({
      where: {
        id_impresora: ImpreId,
      },
      include: {
        marcas: true,
        sucursales: true,
      },
    });
    return impresora;
  },
  findBySerial: async (serial) => {
    try {
      const impresora = await prisma.impresoras.findFirst({
        where: {
          serial: {
            contains: serial,
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
    } catch (error) {
      console.error("Error al obtener la impresora:", error);
      throw new Error("Error al obtener la impresora: " + error.message);
    }
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
    try {
      const impresoraUpdated = await prisma.impresoras.update({
        where: {
          id_impresora: impresora.id_impresora,
        },
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
      return impresoraUpdated;
    } catch (error) {
      console.error("Error al actualizar la impresora:", error);
      throw new Error("Error al actualizar la impresora: " + error.message);
    }
  },
  async delete(id) {
    const ImpreId = Number(id);
    const impresoraDeleted = await prisma.impresoras.update({
      where: {
        id_impresora: ImpreId,
      },
      data: {
        estado: "Fuera de servicio",
      },
    });
    return impresoraDeleted;
  },
};
