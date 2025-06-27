import { prisma } from "../../../prisma/prismaCliente.js";

export const tonerImpresoraModel = {
  async getAll() {
    const tonerImpresora = await prisma.toner_impresora.findMany({
      where: {
        toner: {
          estado: {
            not: "Fuera de servicio",
          },
        },
        impresoras: {
          estado: {
            not: "Fuera de servicio",
          },
        },
      },
      select: {
        toner_id: true,
        impresora_id: true,
        toner: {
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
        },
        impresoras: {
          select: {
            id_impresora: true,
            nombre: true,
            modelo: true,
            sucursal_id: true,
            serial: true,
            tipo: true,
            marcas: true,
            sucursales: {
              select: {
                id_sucursal: true,
                nombre: true,
                sedes: {
                  select: {
                    id_sede: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return tonerImpresora.length > 0 ? tonerImpresora : [];
  },
  async getInfoByIdToner(id) {
    const tonerImpresora = await prisma.toner_impresora.findUnique({
      where: {
        toner_id: id,
      },
      include: {
        toner: true,
        impresoras: true,
      },
    });
    return tonerImpresora;
  },
};
