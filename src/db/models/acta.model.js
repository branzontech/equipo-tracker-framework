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
            prestamo_perifericos_directos: {
              include: {
                perifericos: {
                  include: {
                    marcas: true,
                  },
                },
              },
            },
            prestamo_impresoras: {
              include: {
                impresoras: {
                  include: {
                    marcas: true,
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
                    estado_ubicacion: {
                      include: {
                        sucursales: true,
                      },
                    },
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
            traslado_perifericos_directos: {
              include: {
                perifericos: {
                  include: {
                    marcas: true,
                  },
                },
              },
            },
            traslado_impresoras: {
              include: {
                impresoras: {
                  include: {
                    marcas: true,
                    sucursales: true,
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
        devoluciones: {
          include: {
            actas: true,
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
                prestamo_perifericos_directos: {
                  include: {
                    perifericos: {
                      include: { marcas: true },
                    },
                  },
                },
                prestamo_impresoras: {
                  include: {
                    impresoras: {
                      include: {
                        marcas: true,
                        sucursales: true,
                      },
                    },
                  },
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
                sucursales: {
                  include: {
                    sedes: true,
                  },
                },
              },
            },
            usuarios_devoluciones_usuario_entrega_idTousuarios: {
              select: { nombre: true, firma: true },
            },
            usuarios_devoluciones_usuario_recibe_idTousuarios: {
              select: { nombre: true, firma: true },
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

      // --- Devoluciones
      const devoluciones = Object.values(acta.devoluciones || {}).map(
        (devolucion) => {
          const entrega =
            devolucion.usuarios_devoluciones_usuario_entrega_idTousuarios;
          const recibe =
            devolucion.usuarios_devoluciones_usuario_recibe_idTousuarios;

          return {
            ...devolucion,
            usuarios_devoluciones_usuario_entrega_idTousuarios: entrega
              ? { ...entrega, firma: toBase64(entrega.firma) }
              : null,
            usuarios_devoluciones_usuario_recibe_idTousuarios: recibe
              ? { ...recibe, firma: toBase64(recibe.firma) }
              : null,
          };
        }
      );

      return {
        ...acta,
        prestamos,
        traslados,
        bajas,
        devoluciones,
      };
    });

    return actasWithFirmas;
  },
  async getInfoEquipo(nro_serie) {
    const equipo = await prisma.equipos.findUnique({
      where: { nro_serie },
      select: { id_equipo: true },
    });

    if (!equipo) {
      throw new Error("No se encontró el equipo.");
    }

    const equipoId = equipo.id_equipo;

    const [prestamoActivo, trasladoActivo, bajaAsociada, mantenimientos] =
      await Promise.all([
        prisma.prestamo_equipos.findFirst({
          where: { equipo_id: equipoId },
          include: {
            prestamos: {
              where: {
                estado: {
                  not: "Finalizado",
                },
              },
            },
          },
        }),
        prisma.traslados_equipos.findFirst({
          where: { equipo_id: equipoId },
          include: {
            traslados: {
              where: {
                estado: {
                  not: "Finalizado",
                },
              },
            },
          },
        }),
        prisma.bajas_equipos.findFirst({
          where: {
            equipo_id: equipoId,
            bajas: {
              estado: {
                not: "Cancelada",
              },
            },
          },
        }),
        prisma.mantenimientos.findFirst({
          where: {
            equipo_id: equipoId,
            estado: {
              not: "Finalizado",
            },
          },
        }),
      ]);

    const enPrestamo = !!prestamoActivo?.prestamos;
    const enTraslado = !!trasladoActivo?.traslados;
    const enBaja = !!bajaAsociada;
    const enMantenimiento = !!mantenimientos;

    return {
      disponible: !(enPrestamo || enTraslado || enBaja || enMantenimiento),
      enPrestamo,
      enTraslado,
      enBaja,
      enMantenimiento,
    };
  },
  async getInfoPeriferico(serial) {
    const periferico = await prisma.perifericos.findFirst({
      where: { serial: serial },
      select: { id_periferico: true },
    });

    if (!periferico) {
      throw new Error("No se encontró el periférico.");
    }

    const perifericoId = periferico.id_periferico;

    const [prestamoActivo, trasladoActivo, bajaAsociada, mantenimientos] =
      await Promise.all([
        prisma.prestamo_perifericos_directos.findFirst({
          where: { periferico_id: perifericoId },
          include: {
            prestamos: {
              where: {
                estado: {
                  not: "Finalizado",
                },
              },
            },
          },
        }),
        // prisma.traslados_perifericos.findFirst({
        //   where: { periferico_id: perifericoId },
        //   include: {
        //     traslados: {
        //       where: {
        //         estado: {
        //           not: "Finalizado",
        //         },
        //       },
        //     },
        //   },
        // }),
        // prisma.bajas_equipos.findFirst({
        //   where: {
        //     equipo_id: periferico.equipo_asociado_id,
        //     bajas: {
        //       estado: {
        //         not: "Cancelada",
        //       },
        //     },
        //   },
        // }),
        // prisma.mantenimientos.findFirst({
        //   where: {
        //     equipo_id: periferico.equipo_asociado_id,
        //     estado: {
        //       not: "Finalizado",
        //     },
        //   },
        // }),
      ]);

    const enPrestamo = !!prestamoActivo?.prestamos;
    const enTraslado = !!trasladoActivo?.traslados;
    const enBaja = !!bajaAsociada;
    const enMantenimiento = !!mantenimientos;

    return {
      disponible: !(enPrestamo || enTraslado || enBaja || enMantenimiento),
      enPrestamo,
      enTraslado,
      enBaja,
      enMantenimiento,
    };
  },
  async getInfoImpresora(serial) {
    const impresora = await prisma.impresoras.findFirst({
      where: { serial: serial },
      select: { id_impresora: true },
    });

    if (!impresora) {
      throw new Error("No se encontró el impresora.");
    }

    const impresoraId = impresora.id_impresora;

    const [prestamoActivo, trasladoActivo, bajaAsociada, mantenimientos] =
      await Promise.all([
        prisma.prestamo_impresoras.findFirst({
          where: { impresora_id: impresoraId },
          include: {
            prestamos: {
              where: {
                estado: {
                  not: "Finalizado",
                },
              },
            },
          },
        }),
        // prisma.traslados_impresoras.findFirst({
        //   where: { impresora_id: impresoraId },
        //   include: {
        //     traslados: {
        //       where: {
        //         estado: {
        //           not: "Finalizado",
        //         },
        //       },
        //     },
        //   },
        // }),
        // prisma.bajas_impresoras.findFirst({
        //   where: {
        //     impresora_id: impresoraId,
        //     bajas: {
        //       estado: {
        //         not: "Cancelada",
        //       },
        //     },
        //   },
        // }),
        // prisma.mantenimientos_impresoras.findFirst({
        //   where: {
        //     impresora_id: impresoraId,
        //     estado: {
        //       not: "Finalizado",
        //     },
        //   },
        // }),
      ]);

    const enPrestamo = !!prestamoActivo?.prestamos;
    const enTraslado = !!trasladoActivo?.traslados;
    const enBaja = !!bajaAsociada;
    const enMantenimiento = !!mantenimientos;

    return {
      disponible: !(enPrestamo || enTraslado || enBaja || enMantenimiento),
      enPrestamo,
      enTraslado,
      enBaja,
      enMantenimiento,
    };
  },
  updateStatus: async (id, newStatus, tipo, acta_equipos) => {
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
          if (newStatus === "Cancelada") {
            // Update status of the equipment
            for (const acta_equipo of acta_equipos) {
              const equipo = await prisma.equipos.findUnique({
                where: { nro_serie: acta_equipo.equipos.nro_serie },
              });
              if (equipo) {
                await prisma.equipos.update({
                  where: { id_equipo: equipo.id_equipo },
                  data: { estado_actual: "Activo" },
                });

                // Update perifericos status
                await prisma.perifericos.updateMany({
                  where: { equipo_asociado_id: equipo.id_equipo },
                  data: { estado: "Activo" },
                });
              }
            }
          }

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
