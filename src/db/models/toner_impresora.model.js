import { prisma } from "../../../prisma/prismaCliente.js";

export const tonerImpresoraModel = {
  async getAll() {
    const tonerImpresora = await prisma.toner_impresora.findMany({
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
          },
        },
        impresora: {
          select: {
            id_impresora: true,
            nombre: true,
            modelo: true,
            sucursal_id: true,
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
    return tonerImpresora;
  },
};
