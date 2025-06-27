import { prisma } from "../../../prisma/prismaCliente.js";

export const tonersModel = {
  async getAll() {
    const toner = await prisma.toner.findMany({
      where: {
        estado: {
          not: "Fuera de servicio",
        },
      },
      select: {
        id_toner: true,
        modelo: true,
        color: true,
        cantidad: true,
        stock_actual: true,
        stock_minimo_alerta: true,
        estado: true,
        serial: true,
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
        serial: toner.serial,
        estado: toner.estado,

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
          serial: toner.serial,
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
  async getBySerial(serial) {
    try {
      const toner = await prisma.toner.findMany({
        where: {
          serial: {
            contains: serial,
            mode: "insensitive",
          },
        },
        select: {
          id_toner: true,
          modelo: true,
          color: true,
          cantidad: true,
          stock_actual: true,
          stock_minimo_alerta: true,
          estado: true,
          serial: true,
        },
        take: 10,
      });
      return toner;
    } catch (error) {
      console.error("Error al obtener el toner:", error);
      throw new Error("Error al obtener el toner: " + error.message);
    }
  },
  async createSalidaToner(salidaToner) {
    const {
      cantidad,
      observaciones,
      toner_id,
      sucursal_id,
      usuario_id,
      impresora_destino_id,
    } = salidaToner;

    try {
      // Verificar que exista el toner y que tenga stock suficiente
      const toner = await prisma.toner.findUnique({
        where: { id_toner: toner_id },
      });

      if (!toner) {
        throw new Error("El toner especificado no existe.");
      }

      if (toner.stock_actual < cantidad) {
        throw new Error("Stock insuficiente para esta salida.");
      }

      // Crear la salida de toner
      const salidaTonerCreated = await prisma.salidatoners.create({
        data: {
          cantidad,
          observaciones,
          toner: {
            connect: { id_toner: toner_id },
          },
          sucursales: {
            connect: { id_sucursal: sucursal_id },
          },
          usuarios: {
            connect: { id_usuario: usuario_id },
          },
          impresoras: {
            connect: { id_impresora: impresora_destino_id },
          },
        },
      });

      // Descontar del stock actual del toner
      await prisma.toner.update({
        where: { id_toner: toner_id },
        data: {
          stock_actual: {
            decrement: cantidad,
          },
        },
      });

      return salidaTonerCreated;
    } catch (error) {
      console.error("Error al crear la salida toner:", error);
      throw new Error("Error al crear la salida toner: " + error.message);
    }
  },
};
