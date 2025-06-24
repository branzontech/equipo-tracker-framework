import { prisma } from "../../../prisma/prismaCliente.js";

export const devolucionModel = {
  findAll: async () => {
    const devoluciones = await prisma.devoluciones.findMany({
      select: {
        id_devolucion: true,
        prestamo_id: true,
        traslado_id: true,
        fecha_devolucion: true,
        motivo: true,
        usuario_entrega_id: true,
        usuario_recibe_id: true,
        estado: true,
      },
    });
    return devoluciones;
  },
  async findEquiposEnMovimiento() {
    const equiposPrestamo = await prisma.equipos.findMany({
      where: {
        estado_ubicacion: {
          none: {
            estado_actual: "Activo",
          },
        },
      },
      include: {
        estado_ubicacion: true,
        prestamo_equipos: {
          orderBy: { id: "desc" },
          take: 1,
          include: {
            prestamos: {
              include: {
                actas: true,
                usuarios_prestamos_responsable_salida_idTousuarios: {
                  select: {
                    nombre: true,
                  },
                },
                usuarios_prestamos_responsable_entrada_idTousuarios: {
                  select: {
                    nombre: true,
                  },
                },
                prestamo_equipos: {
                  include: {
                    prestamo_perifericos: {
                      include: {
                        perifericos: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const perifericosDirectosPrestamo =
      await prisma.prestamo_perifericos_directos.findMany({
        where: {
          perifericos: {
            estado: "En Préstamo",
          },
        },
        include: {
          prestamos: {
            include: {
              actas: true,
              usuarios_prestamos_responsable_salida_idTousuarios: {
                select: { nombre: true },
              },
              usuarios_prestamos_responsable_entrada_idTousuarios: {
                select: { nombre: true },
              },
            },
          },
          perifericos: {
            include: {
              marcas: true,
            },
          },
        },
      });

    const impresorasPrestamo = await prisma.prestamo_impresoras.findMany({
      where: {
        impresoras: {
          estado: "En Préstamo",
        },
      },
      include: {
        impresoras: {
          include: {
            marcas: true,
            sucursales: true,
          },
        },
        prestamos: {
          include: {
            actas: true,
            usuarios_prestamos_responsable_salida_idTousuarios: {
              select: {
                nombre: true,
              },
            },
            usuarios_prestamos_responsable_entrada_idTousuarios: {
              select: {
                nombre: true,
              },
            },
          },
        },
      },
    });

    const equiposTraslado = await prisma.equipos.findMany({
      where: {
        estado_ubicacion: {
          none: {
            estado_actual: "Activo",
          },
        },
      },
      include: {
        traslados_equipos: {
          orderBy: { id: "desc" },
          take: 1,
          include: {
            traslados: {
              include: {
                actas: true,
                usuarios_traslados_responsable_entrada_idTousuarios: true,
                usuarios_traslados_responsable_salida_idTousuarios: true,
                sucursales: {
                  include: {
                    sedes: true,
                  },
                },
                traslados_equipos: {
                  include: {
                    traslados_perifericos: {
                      include: {
                        perifericos: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return {
      prestamos: equiposPrestamo,
      prestamos_directos: perifericosDirectosPrestamo,
      impresoras: impresorasPrestamo,
      traslados: equiposTraslado,
    };
  },
  create: async (devolucion) => {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      // Validar que solo se proporcione préstamo o traslado (nunca ambos)
      if (
        (devolucion.prestamo_id && devolucion.traslado_id) ||
        (!devolucion.prestamo_id && !devolucion.traslado_id)
      ) {
        throw new Error("Debe especificarse solo préstamo o traslado");
      }

      // Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Devolucion",
          fecha: hoy,
        },
      });

      // Crear la devolución
      const devolucionCreated = await prisma.devoluciones.create({
        data: {
          actas: { connect: { id_acta: nuevaActa.id_acta } },
          ...(devolucion.prestamo_id > 0 && {
            prestamos: {
              connect: { id_prestamo: devolucion.prestamo_id },
            },
          }),
          ...(devolucion.traslado_id > 0 && {
            traslados: {
              connect: { id_traslado: devolucion.traslado_id },
            },
          }),
          fecha_devolucion: devolucion.fecha_devolucion,
          motivo: devolucion.motivo,
          estado_equipo: devolucion.estado_equipo,
          observaciones: devolucion.observaciones,
          usuarios_devoluciones_usuario_entrega_idTousuarios: {
            connect: { id_usuario: devolucion.usuario_entrega_id },
          },
          usuarios_devoluciones_usuario_recibe_idTousuarios: {
            connect: { id_usuario: devolucion.usuario_recibe_id },
          },
        },
      });

      // Actualizar el estado del préstamo o traslado
      if (devolucion.prestamo_id) {
        await prisma.prestamos.update({
          where: { id_prestamo: devolucion.prestamo_id },
          data: { estado: "Finalizado" },
        });
      }

      if (devolucion.traslado_id) {
        await prisma.traslados.update({
          where: { id_traslado: devolucion.traslado_id },
          data: { estado: "Finalizado" },
        });
      }

      // Determinar el estado del equipo
      const estadoEquipo =
        devolucion.estado_equipo === "Óptimo" ? "Activo" : "Inactivo";

      if (devolucion.tipo === "EQUIPO") {
        await prisma.estado_ubicacion.updateMany({
          where: {
            equipo_id: devolucion.equipo_id,
          },
          data: {
            estado_actual: estadoEquipo,
          },
        });

        // Actualizar los periféricos asociados si hay
        await prisma.perifericos.updateMany({
          where: { equipo_asociado_id: devolucion.equipo_id },
          data: { estado: estadoEquipo },
        });
      }

      if (devolucion.tipo === "PERIFERICO") {
        await prisma.perifericos.update({
          where: { id_periferico: devolucion.equipo_id },
          data: { estado: estadoEquipo },
        });
      }

      if (devolucion.tipo === "IMPRESORA") {
        await prisma.impresoras.update({
          where: { id_impresora: devolucion.equipo_id },
          data: { estado: estadoEquipo },
        });
      }

      return devolucionCreated;
    } catch (error) {
      console.error("❌ Error al crear la devolución:", error);
      return error;
    }
  },
};
