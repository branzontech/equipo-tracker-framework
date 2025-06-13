import { prisma } from "../../../prisma/prismaCliente.js";

export const trasladoModel = {
  findAll: async () => {
    const traslados = await prisma.traslados.findMany({
      select: {
        id_traslado: true,
        acta_id: true,
        fecha_traslado: true,
        motivo: true,
        observaciones: true,
        responsable_salida_id: true,
        responsable_entrada_id: true,
        sucursal_destino_id: true,
      },
    });
    return traslados;
  },
  create: async (traslado) => {

    try {
      // 1. Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Traslado",
          fecha: new Date(),
        },
      });

      // 2. Crear el traslado y asociar usuarios
      const trasladoCreated = await prisma.traslados.create({
        data: {
          fecha_traslado: traslado.fecha_traslado,
          motivo: traslado.motivo,
          observaciones: traslado.observaciones,
          estado: "Pendiente",
          actas: { connect: { id_acta: nuevaActa.id_acta } },
          usuarios_traslados_responsable_entrada_idTousuarios: {
            connect: { id_usuario: traslado.responsable_entrada_id },
          },
          usuarios_traslados_responsable_salida_idTousuarios: {
            connect: { id_usuario: traslado.responsable_salida_id },
          },
          sucursales: { connect: { id_sucursal: traslado.sucursal_destino_id } },
        },
      });

      // Iterar por equipos del traslado
      for (const equipo of traslado.equipos) {
        // Relacionar equipo con acta
        // await prisma.acta_equipos.create({
        //   data: {
        //     acta_id: nuevaActa.id_acta,
        //     equipo_id: equipo.id_equipo,
        //   },
        // });

        // Crear relación en Traslado_Equipos
        const trasladoEquipo = await prisma.traslados_equipos.create({
          data: {
            traslado_id: trasladoCreated.id_traslado,
            equipo_id: equipo.id_equipo,
          },
        });

        // Insertar perifericos relacionados (si hay)
        if (equipo.perifericos && equipo.perifericos.length > 0) {
          for (const periferico_id of equipo.perifericos) {
            try {
              await prisma.traslados_perifericos.create({
                data: {
                  traslado_equipo_id: trasladoEquipo.id,
                  periferico_id,
                },
              });
            } catch (error) {
              console.error(
                `❌ Error insertando periférico ${periferico_id}:`,
                error
              );
            }
          }
        }
      }

      return trasladoCreated;
    } catch (error) {
      console.error("Error al crear el traslado:", error);
      return error;
    }
  },
};
