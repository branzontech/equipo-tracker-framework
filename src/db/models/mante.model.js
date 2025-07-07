import { prisma } from "../../../prisma/prismaCliente.js";

export const manteModel = {
  async getAll() {
    try {
      const mante = await prisma.mantenimientos.findMany({
        select: {
          id_mantenimiento: true,
          equipo_id: true,
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
          impresora_id: true,
          tecnico_id: true,
          usuarios: {
            select: {
              nombre: true,
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
      throw error("Error al obtener mantenimientos", error);
    }
  },
  async getById(id) {
    const id_mantenimiento = Number(id);
    const mante = await prisma.mantenimientos.findUnique({
      select: {
        id_mantenimiento: true,
        equipo_id: true,
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
        impresora_id: true,
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
      },
      where: {
        id_mantenimiento: id_mantenimiento,
      },
    });
    return mante;
  },
  async create(data) {
    try {
      const mante = await prisma.mantenimientos.create({
        data: {
          equipo_id:
            data.id_equipo && data.id_equipo > 0 ? data.id_equipo : undefined,
          impresora_id:
            data.id_impresora && data.id_impresora > 0
              ? data.id_impresora
              : undefined,
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

      // ✅ Actualizar estado del equipo
      if (data.id_equipo && data.id_equipo > 0) {
        await prisma.estado_ubicacion.updateMany({
          where: { equipo_id: data.id_equipo },
          data: {
            estado_actual: "En mantenimiento",
          },
        });

        await prisma.perifericos.updateMany({
          where: { equipo_asociado_id: data.id_equipo },
          data: { estado: "En mantenimiento" },
        });
      }

      // ✅ Actualizar estado de la impresora
      if (data.id_impresora && data.id_impresora > 0) {
        await prisma.impresoras.update({
          where: { id_impresora: data.id_impresora },
          data: { estado_actual: "En mantenimiento" },
        });
      }
      return mante;
    } catch (error) {
      console.log(error);
      throw error("Error al crear mantenimiento", error);
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
  async delete(id) {
    const mante = await prisma.mantenimientos.delete({
      where: {
        id: id,
      },
    });
    return mante;
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
      calificacion,
      observaciones,
      fechaRealizacion,
    } = data;

    console.log("saveResponse", data);

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
            calificacion,
            observaciones,
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
          calificacion,
          observaciones,
          fecha_realizacion: fechaRealizacion ?? new Date(),
        },
      });
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
