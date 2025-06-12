import { prisma } from "../../../prisma/prismaCliente.js";

export const bajaModel = {
  findAll: async () => {
    const bajas = await prisma.bajas.findMany({
      select: {
        id_baja: true,
        acta_id: true,
        fecha_baja: true,
        observaciones_adicionales: true,
        estado: true,
        responsable_autorizacion_id: true,
        responsable_solicitud_id: true,
        equipos: true,
      },
    });
    return bajas;
  },
  create: async (baja) => {
    try {
      // 1. Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Baja",
          fecha: new Date(),
        },
      });

      // 2. Crear la baja y asociar usuarios
      const bajaCreated = await prisma.bajas.create({
        data: {
          fecha_baja: baja.fecha_baja,
          observaciones_adicionales: baja.observaciones_adicionales,
          estado: baja.estado,
          actas: { connect: { id_acta: nuevaActa.id_acta } },
          usuarios_bajas_responsable_autorizacion_idTousuarios: {
            connect: { id_usuario: baja.responsable_autorizacion_id },
          },
          usuarios_bajas_responsable_solicitud_idTousuarios: {
            connect: { id_usuario: baja.responsable_solicitud_id },
          },
        },
      });

      // Iterar por equipos del baja
      for (const equipo of baja.equipos) {
        // Relacionar equipo con acta
        await prisma.acta_equipos.create({
          data: {
            acta_id: nuevaActa.id_acta,
            equipo_id: equipo.id_equipo,
          },
        });

        // Crear relación en Bajas_Equipos
        await prisma.bajas_equipos.create({
          data: {
            baja_id: bajaCreated.id_baja,
            equipo_id: equipo.id_equipo,
            motivos: equipo.motivo,
          },
        });

        await prisma.perifericos.updateMany({
          where: {
            equipo_asociado_id: equipo.id_equipo,
          },
          data: {
            estado: "Inactivo por Baja",
          },
        });
      }

      return bajaCreated;
    } catch (error) {
      console.error("Error al crear la baja:", error);
      return error;
    }
  },
};
