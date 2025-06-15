import { prisma } from "../../../prisma/prismaCliente.js";

export const ActaModel = {
  findAll: async () => {
    const actas = await prisma.actas.findMany({
      include: {
        prestamos: {
          include: {
            prestamo_equipos: {
              include: {
                equipos: {
                  include: {
                    marcas: true,
                  },
                },
                prestamo_perifericos: {
                  include: {
                    perifericos: true,
                  },
                },
              },
            },
            usuarios_prestamos_responsable_salida_idTousuarios: {
              select: { nombre: true, firma: true },
            },
            usuarios_prestamos_responsable_entrada_idTousuarios: {
              select: { nombre: true, firma: true },
            },
          },
        },
        bajas: {
          include: {
            bajas_equipos: {
              include: {
                equipos: {
                  include: {
                    marcas: true,
                  },
                },
              },
            },
            usuarios_bajas_responsable_autorizacion_idTousuarios: {
              select: { nombre: true, firma: true },
            },
            usuarios_bajas_responsable_solicitud_idTousuarios: {
              select: { nombre: true, firma: true },
            },
          },
        },
        traslados: {
          include: {
            traslados_equipos: {
              include: {
                equipos: {
                  include: {
                    marcas: true,
                  },
                },
                traslados_perifericos: {
                  include: {
                    perifericos: true,
                  },
                },
              },
            },
            usuarios_traslados_responsable_salida_idTousuarios: {
              select: { nombre: true, firma: true },
            },
            usuarios_traslados_responsable_entrada_idTousuarios: {
              select: { nombre: true, firma: true },
            },
            sucursales: {
              include: {
                sedes: true,
              },
            },
          },
        },
      },
    });

    const toBase64 = (firma) => {
      if (!firma || typeof firma !== "object") return null;
      const bytes = new Uint8Array(Object.values(firma));
      return `data:image/png;base64,${Buffer.from(bytes).toString("base64")}`;
    };

    const actasWithFirmas = actas.map((acta) => {
      // --- Prestamos
      const prestamos = Object.values(acta.prestamos || {}).map((prestamo) => {
        const salida =
          prestamo.usuarios_prestamos_responsable_salida_idTousuarios;
        const entrada =
          prestamo.usuarios_prestamos_responsable_entrada_idTousuarios;

        return {
          ...prestamo,
          usuarios_prestamos_responsable_salida_idTousuarios: salida
            ? { ...salida, firma: toBase64(salida.firma) }
            : null,
          usuarios_prestamos_responsable_entrada_idTousuarios: entrada
            ? { ...entrada, firma: toBase64(entrada.firma) }
            : null,
        };
      });

      // --- Traslados
      const traslados = Object.values(acta.traslados || {}).map((traslado) => {
        const salida =
          traslado.usuarios_traslados_responsable_salida_idTousuarios;
        const entrada =
          traslado.usuarios_traslados_responsable_entrada_idTousuarios;

        return {
          ...traslado,
          usuarios_traslados_responsable_salida_idTousuarios: salida
            ? { ...salida, firma: toBase64(salida.firma) }
            : null,
          usuarios_traslados_responsable_entrada_idTousuarios: entrada
            ? { ...entrada, firma: toBase64(entrada.firma) }
            : null,
        };
      });

      // --- Bajas
      const bajas = Object.values(acta.bajas || {}).map((baja) => {
        const autorizacion =
          baja.usuarios_bajas_responsable_autorizacion_idTousuarios;
        const solicitud =
          baja.usuarios_bajas_responsable_solicitud_idTousuarios;

        return {
          ...baja,
          usuarios_bajas_responsable_autorizacion_idTousuarios: autorizacion
            ? { ...autorizacion, firma: toBase64(autorizacion.firma) }
            : null,
          usuarios_bajas_responsable_solicitud_idTousuarios: solicitud
            ? { ...solicitud, firma: toBase64(solicitud.firma) }
            : null,
        };
      });

      return {
        ...acta,
        prestamos,
        traslados,
        bajas,
      };
    });

    return actasWithFirmas;
  },
  updateStatus: async (id, newStatus, tipo) => {
    try {
      switch (tipo) {
        case "Prestamo":
          return await prisma.prestamos.update({
            where: { id_prestamo: id },
            data: { estado: newStatus },
          });

        case "Traslado":
          return await prisma.traslados.update({
            where: { id_traslado: id },
            data: { estado: newStatus },
          });

        case "Baja":
          return await prisma.bajas.update({
            where: { id_baja: id },
            data: { estado: newStatus },
          });

        default:
          throw new Error(`Tipo de acta desconocido: ${tipo}`);
      }
    } catch (error) {
      throw new Error("Error al actualizar el estado del acta: " + error);
    }
  },
};
