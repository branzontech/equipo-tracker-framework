import { prisma } from "../../../prisma/prismaCliente.js";

export const manteModel = {
  async getAll() {
    try {
      const mante = await prisma.mantenimientos.findMany({
        select: {
          id_mantenimiento: true,
          tecnico_id: true,
          usuarios: {
            select: { nombre: true },
          },
          fecha_programada: true,
          tipo: true,
          prioridad: true,
          descripcion: true,
          tiempo_estimado: true,
          recomendaciones: true,
          observaciones_adi: true,
          estado: true,
          progreso: true,
          archivosmantenimiento: {
            select: {
              id_archivo: true,
              mantenimiento_id: true,
              nombre_archivo: true,
              tipo_archivo: true,
              fecha_subida: true,
              archivo: true,
            },
          },
          mantenimiento_detalle: {
            include: {
              equipos: {
                include: {
                  estado_ubicacion: {
                    select: {
                      sucursales: {
                        include: {
                          sedes: {
                            include: {
                              usuario_sede: {
                                include: {
                                  usuarios: {
                                    select: {
                                      nombre: true,
                                      email: true,
                                      rol: true,
                                    },
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
              impresoras: {
                include: {
                  sucursales: {
                    include: {
                      sedes: {
                        select: {
                          nombre: true,
                        },
                      },
                    },
                  },
                },
              },
              perifericos: {
                include: {
                  sucursales: {
                    include: {
                      sedes: {
                        select: {
                          nombre: true,
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

      const result = mante.map((m) => ({
        ...m,
        archivosmantenimiento: m.archivosmantenimiento.map((a) => ({
          ...a,
          archivo: a.archivo
            ? {
                content: Buffer.from(a.archivo).toString("base64"),
                nombre: a.nombre_archivo,
                tipo: a.tipo_archivo,
              }
            : null,
        })),
      }));

      return result;
    } catch (error) {
      console.log(error);
      throw new Error("Error al obtener mantenimientos");
    }
  },
  async getById(id) {
    const id_mantenimiento = Number(id);
    const mante = await prisma.mantenimientos.findUnique({
      select: {
        id_mantenimiento: true,
        tecnico_id: true,
        usuarios: {
          select: {
            nombre: true,
            rol: true,
            email: true,
          },
        },
        fecha_programada: true,
        tipo: true,
        prioridad: true,
        descripcion: true,
        tiempo_estimado: true,
        recomendaciones: true,
        observaciones_adi: true,
        estado: true,
        progreso: true,
        checklist_campos: true,
        checklist_plantillas: {
          select: {
            id_plantilla: true,
            nombre: true,
            tipo_equipo: true,
            tipo_calificacion: true,
            campos: true,
            creado_por: true,
            fecha_creacion: true,
            usuarios: {
              select: {
                id_usuario: true,
                nombre: true,
                email: true,
                rol: true,
              },
            },
          },
        },
        mantenimiento_detalle: {
          include: {
            equipos: {
              include: {
                estado_ubicacion: {
                  include: {
                    sucursales: {
                      include: {
                        sedes: {
                          include: {
                            usuario_sede: {
                              include: {
                                usuarios: {
                                  select: {
                                    nombre: true,
                                    email: true,
                                    rol: true,
                                  },
                                },
                              },
                            },
                          },
                        },
                      },
                    },
                    usuarios: {
                      select: {
                        nombre: true,
                        rol: true,
                        id_usuario: true,
                      },
                    },
                  },
                },
              },
            },
            impresoras: {
              include: {
                sucursales: {
                  include: {
                    sedes: {
                      select: {
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
            perifericos: {
              include: {
                sucursales: {
                  include: {
                    sedes: {
                      select: {
                        nombre: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
      where: { id_mantenimiento },
    });
    return mante;
  },
  async create(data) {
    try {
      const mante = await prisma.mantenimientos.create({
        data: {
          tecnico_id: data.tecnico_id,
          fecha_programada: data.fecha_programada,
          tipo: data.tipo,
          prioridad: data.prioridad,
          descripcion: data.descripcion,
          tiempo_estimado: data.tiempo_estimado,
          recomendaciones: data.recomendaciones,
          observaciones_adi: data.observaciones_adi,
          estado: data.estado,
          progreso: data.progreso,
          checklist_campos: data.checklist_campos,
          plantilla_id:
            data.plantilla_id && data.plantilla_id > 0
              ? data.plantilla_id
              : undefined,
        },
      });

      // 👉 Registrar detalle de equipos
      if (data.mantenimiento_detalle && data.mantenimiento_detalle.length > 0) {
        for (const detalle of data.mantenimiento_detalle) {
          if (detalle.equipos) {
            await prisma.mantenimiento_detalle.create({
              data: {
                mantenimientos: {
                  connect: { id_mantenimiento: mante.id_mantenimiento },
                },
                equipos: { connect: { id_equipo: detalle.equipos.id_equipo } },
              },
            });

            await prisma.estado_ubicacion.updateMany({
              where: { equipo_id: detalle.equipos.id_equipo },
              data: { estado_actual: "En mantenimiento" },
            });

            await prisma.perifericos.updateMany({
              where: { equipo_asociado_id: detalle.equipos.id_equipo },
              data: { estado: "En mantenimiento" },
            });
          }

          if (detalle.impresora) {
            await prisma.mantenimiento_detalle.create({
              data: {
                mantenimientos: {
                  connect: { id_mantenimiento: mante.id_mantenimiento },
                },
                impresoras: {
                  connect: { id_impresora: detalle.impresora.id_impresora },
                },
              },
            });

            await prisma.impresoras.update({
              where: { id_impresora: detalle.impresora.id_impresora },
              data: { estado_actual: "En mantenimiento" },
            });
          }

          if (detalle.perifericos) {
            await prisma.mantenimiento_detalle.create({
              data: {
                mantenimientos: {
                  connect: { id_mantenimiento: mante.id_mantenimiento },
                },
                perifericos: {
                  connect: { id_periferico: detalle.perifericos.id_periferico },
                },
              },
            });

            await prisma.perifericos.update({
              where: { id_periferico: detalle.perifericos.id_periferico },
              data: { estado: "En mantenimiento" },
            });
          }
        }
      }

      return mante;
    } catch (error) {
      console.log(error);
      throw new Error("Error al crear mantenimiento");
    }
  },
  async updateStatus(id, status) {
    const id_mantenimiento = Number(id);
    try {
      const mante = await prisma.mantenimientos.update({
        data: { estado: status },
        where: { id_mantenimiento: id_mantenimiento },
      });
      return mante;
    } catch (error) {
      throw error("Error al actualizar mantenimiento", error);
    }
  },
  async uploadFiles(id, files) {
    const id_mantenimiento = Number(id);
    try {
      const mante = await prisma.mantenimientos.update({
        where: { id_mantenimiento: id_mantenimiento },
        data: {
          archivosmantenimiento: {
            create: files.map((file) => ({
              nombre_archivo: file.originalname,
              tipo_archivo: file.mimetype,
              archivo: file.buffer,
              fecha_subida: new Date(),
            })),
          },
        },
      });

      return mante;
    } catch (error) {
      console.log(error);
      throw error("Error al subir archivos", error);
    }
  },
  async getFiles() {
    const files = await prisma.archivosmantenimiento.findMany();
    return files;
  },
  async actualizarProgreso(id, progreso) {
    const id_mantenimiento = Number(id);

    try {
      const mante = await prisma.mantenimientos.update({
        where: { id_mantenimiento },
        data: { progreso },
      });

      return mante;
    } catch (error) {
      console.error("Error al actualizar progreso:", error);
      throw new Error("Error al actualizar progreso");
    }
  },
  async saveResponse(data) {
    const {
      mantenimientoId,
      plantillaId,
      tecnicoId,
      respuestas,
      fechaRealizacion,
    } = data;

    try {
      const existingResponse = await prisma.checklist_respuestas.findFirst({
        where: { mantenimiento_id: mantenimientoId },
        orderBy: { fecha_realizacion: "desc" },
      });

      if (existingResponse) {
        return await prisma.checklist_respuestas.update({
          where: { id_respuesta: existingResponse.id_respuesta },
          data: {
            plantilla_id: plantillaId,
            respuestas,
            fecha_realizacion: fechaRealizacion ?? new Date(),
          },
        });
      }

      return await prisma.checklist_respuestas.create({
        data: {
          mantenimiento_id: mantenimientoId,
          plantilla_id: plantillaId,
          tecnico_id: tecnicoId,
          respuestas,
          fecha_realizacion: fechaRealizacion ?? new Date(),
        },
      });
    } catch (error) {
      console.error("Error al guardar el response:", error);
      throw new Error("Error al guardar el response");
    }
  },
  async finalizeChecklistResponse(data) {
    const { mantenimientoId, observaciones, calificacion, fechaRealizacion } =
      data;

    try {
      const existingResponse = await prisma.checklist_respuestas.findFirst({
        where: { mantenimiento_id: mantenimientoId },
        orderBy: { fecha_realizacion: "desc" },
      });

      if (!existingResponse) {
        throw new Error(
          "No existe una respuesta previa para este mantenimiento"
        );
      }

      const updateResponse = await prisma.checklist_respuestas.update({
        where: { id_respuesta: existingResponse.id_respuesta },
        data: {
          observaciones,
          calificacion,
          fecha_realizacion: fechaRealizacion ?? new Date(),
        },
      });

      const mante = await prisma.mantenimientos.findUnique({
        where: { id_mantenimiento: mantenimientoId },
        include: {
          mantenimiento_detalle: {
            include: {
              equipos: true,
              impresoras: true,
              perifericos: true,
            },
          },
          checklist_plantillas: true,
        },
      });

      if (!mante || mante.mantenimiento_detalle.length === 0) {
        throw new Error("No se encontró ningún detalle del mantenimiento");
      }

      // Lógica adaptable por tipo de calificación
      let nuevoEstado = "Activo";

      const tipo = mante.checklist_plantillas?.tipo_calificacion;

      if (tipo === "ESTRELLAS") {
        if (calificacion <= 2) nuevoEstado = "Fuera de servicio";
      } else if (tipo === "ESCALA") {
        if (calificacion <= 3) nuevoEstado = "Fuera de servicio";
      } else if (tipo === "CATEGORIA") {
        if (calificacion === 1) nuevoEstado = "Fuera de servicio";
      }

      // Actualizar estado según el tipo de cada detalle
      for (const detalle of mante.mantenimiento_detalle) {
        if (detalle.equipos) {
          await prisma.estado_ubicacion.updateMany({
            where: { equipo_id: detalle.equipos.id_equipo },
            data: { estado_actual: nuevoEstado },
          });
        }

        if (detalle.impresora) {
          await prisma.impresoras.update({
            where: { id_impresora: detalle.impresora.id_impresora },
            data: { estado_actual: nuevoEstado },
          });
        }

        if (detalle.perifericos) {
          await prisma.perifericos.update({
            where: { id_periferico: detalle.perifericos.id_periferico },
            data: { estado: nuevoEstado },
          });
        }
      }

      await prisma.mantenimientos.update({
        where: { id_mantenimiento: mantenimientoId },
        data: { estado: "Finalizado", fecha_realizada: new Date() },
      });

      return updateResponse;
    } catch (error) {
      console.error("Error al guardar el response:", error);
      throw new Error("Error al guardar el response");
    }
  },
  async getCheckListResponses(id) {
    const id_mantenimiento = Number(id);
    try {
      const responses = await prisma.checklist_respuestas.findMany({
        where: { mantenimiento_id: id_mantenimiento },
        orderBy: { fecha_realizacion: "desc" },
      });

      return responses;
    } catch (error) {
      console.error("Error al obtener las respuestas:", error);
      throw new Error("Error al obtener las respuestas");
    }
  },
};
