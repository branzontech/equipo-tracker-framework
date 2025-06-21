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
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // 1. Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Baja",
          fecha: hoy,
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
        await prisma.bajas_equipos.create({
          data: {
            baja_id: bajaCreated.id_baja,
            equipo_id: equipo.id_equipo,
            motivos: equipo.motivo,
          },
        });

        await prisma.equipos.updateMany({
          where: { id_equipo: equipo.id_equipo },
          data: { estado_actual: "Fuera de servicio" },
        });

        await prisma.perifericos.updateMany({
          where: { equipo_asociado_id: equipo.id_equipo },
          data: { estado: "Fuera de servicio" },
        });
      }

      return bajaCreated;
    } catch (error) {
      console.error("Error al crear la baja:", error);
      return error;
    }
  },
};
