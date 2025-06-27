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
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // 1. Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Traslado",
          fecha: hoy,
        },
      });

      // 2. Crear el traslado y asociar usuarios
      const trasladoCreated = await prisma.traslados.create({
        data: {
          fecha_traslado: traslado.fecha_traslado,
          motivo: traslado.motivo,
          observaciones: traslado.observaciones,
          estado: "Vigente",
          actas: { connect: { id_acta: nuevaActa.id_acta } },
          usuarios_traslados_responsable_entrada_idTousuarios: {
            connect: { id_usuario: traslado.responsable_entrada_id },
          },
          usuarios_traslados_responsable_salida_idTousuarios: {
            connect: { id_usuario: traslado.responsable_salida_id },
          },
          sucursales: {
            connect: { id_sucursal: traslado.sucursal_destino_id },
          },
        },
      });

      // Iterar por equipos del traslado
      for (const equipo of traslado.equipos) {
        // Crear relación en Traslado_Equipos
        const trasladoEquipo = await prisma.traslados_equipos.create({
          data: {
            traslado_id: trasladoCreated.id_traslado,
            equipo_id: equipo.id_equipo,
          },
        });

        await prisma.estado_ubicacion.updateMany({
          where: { equipo_id: equipo.id_equipo },
          data: {
            estado_actual: "En Traslado",
          },
        });

        await prisma.perifericos.updateMany({
          where: { equipo_asociado_id: equipo.id_equipo },
          data: { estado: "En Traslado" },
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

      if (traslado.perifericos_directos?.length > 0) {
        for (const periferico of traslado.perifericos_directos) {
          await prisma.traslado_perifericos_directos.create({
            data: {
              traslado_id: trasladoCreated.id_traslado,
              periferico_id: periferico.id_periferico,
            },
          });

          // Actualizar estado del periférico
          await prisma.perifericos.update({
            where: { id_periferico: periferico.id_periferico },
            data: { estado: "En Traslado" },
          });
        }
      }

      if (traslado.impresoras?.length > 0) {
        for (const impresora of traslado.impresoras) {
          await prisma.traslado_impresoras.create({
            data: {
              traslado_id: trasladoCreated.id_traslado,
              impresora_id: impresora.id_impresora,
            },
          });

          // Actualizar estado de la impresora
          await prisma.impresoras.update({
            where: { id_impresora: impresora.id_impresora },
            data: { estado: "En Traslado" },
          });
        }
      }

      return trasladoCreated;
    } catch (error) {
      console.error("Error al crear el traslado:", error);
      return error;
    }
  },
};
