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
          select: {
            nro_serie: true,
            nombre_equipo: true,
            modelo: true,
            sucursales: true,
            sucursales: {
              select: {
                nombre: true,
                id_sucursal: true,
                tipo: true,
                sedes: {
                  select: {
                    id_sede: true,
                    nombre: true,
                    regional: true,
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
      },
      where: {
        id_mantenimiento: id_mantenimiento,
      },
    });
    return mante;
  },
  async create(data) {
    const mante = await prisma.mantenimientos.create({
      data: {
        equipo_id:
          data.id_equipo && data.id_equipo > 0 ? data.id_equipo : undefined,
        id_impresora:
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
      },
    });

    // ✅ Actualizar estado del equipo
    if (data.id_equipo && data.id_equipo > 0) {
      await prisma.equipos.update({
        where: { id_equipo: data.id_equipo },
        data: { estado_actual: "En mantenimiento" },
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
};
