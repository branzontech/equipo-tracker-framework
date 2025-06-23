import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/prismaCliente.js";

export const equipoModel = {
  async create(data) {
    console.log(data);
    const categoriaId = Number(data.categoria_id);
    const marcaId = Number(data.marca_id);

    if ([categoriaId, marcaId].some(isNaN)) {
      throw new Error("ID de categoría, marca o sucursal inválido.");
    }

    try {
      return await prisma.equipos.create({
        data: {
          nombre_equipo: data.nombre_equipo,
          nro_serie: data.nro_serie,
          modelo: data.modelo,
          tipo_activo: data.tipo_activo,
          fecha_registro: new Date(data.fecha_registro),
          observaciones: data.observaciones,
          tags: data.tags.join(","),
          imagen: data.imagen
            ? Buffer.from(
                data.imagen.includes(",")
                  ? data.imagen.split(",")[1]
                  : data.imagen,
                "base64"
              )
            : null,

          // Relaciones con otras tablas (FKs)
          categorias: {
            connect: { id_categoria: categoriaId },
          },
          marcas: {
            connect: { id_marca: marcaId },
          },

          // Relaciones 1:N con create
          especificaciones: {
            create: {
              procesador: data.especificaciones.procesador,
              memoria_ram: data.especificaciones.memoria_ram,
              almacenamiento: data.especificaciones.almacenamiento,
              tarjeta_grafica: data.especificaciones.tarjeta_grafica,
              pantalla: data.especificaciones.pantalla,
              sistema_operativo: data.especificaciones.sistema_operativo,
              bateria: data.especificaciones.bateria,
              puertos: data.especificaciones.puertos,
              tienecargador: data.especificaciones.tienecargador,
              serialcargador: data.especificaciones.serialcargador,
              tipo_discoduro: data.especificaciones.tipo_discoduro,
            },
          },

          seguridad: {
            create: {
              nivel_acceso: data.seguridad.nivel_acceso,
              software_seguridad: data.seguridad.software_seguridad,
              cifrado_disco: data.seguridad.cifrado_disco,
              politicas_aplicadas:
                data.seguridad.politicas_aplicadas.join(", "),
            },
          },

          adquisicion: {
            create: {
              orden_compra: data.adquisicion.orden_compra,
              fecha_compra: new Date(data.adquisicion.fecha_compra),
              precio_compra: data.adquisicion.precio_compra,
              forma_pago: data.adquisicion.forma_pago,
              plazo_pago: data.adquisicion.plazo_pago,
              numero_factura: data.adquisicion.numero_factura,
              proveedores: {
                connect: {
                  id_proveedor: data.adquisicion.proveedor_id,
                },
              },
              inicio_garantia: data.adquisicion.inicio_garantia,
              garantia_fecha_fin: data.adquisicion.garantia_fecha_fin,
            },
          },

          estado_ubicacion: {
            create: {
              estado_actual: data.estado_ubicacion.estado_actual,
              sucursales: {
                connect: {
                  id_sucursal: Number(data.estado_ubicacion.sucursal_id),
                },
              },
              departamento: data.estado_ubicacion.departamento,
              usuarios: {
                connect: {
                  id_usuario: Number(data.estado_ubicacion.responsable_id),
                },
              },
              disponibilidad: data.estado_ubicacion.disponibilidad,
              condicion_fisica: data.estado_ubicacion.condicion_fisica,
            },
          },

          administrativa: {
            create: {
              codigo_inventario: data.administrativa.codigo_inventario,
              centro_coste: data.administrativa.centro_coste,
              usuarios: {
                connect: {
                  id_usuario: Number(data.administrativa.autorizado_por_id),
                },
              },
              fecha_activacion: new Date(data.administrativa.fecha_activacion),
              estado_contable: data.administrativa.estado_contable,
              valor_depreciado: new Prisma.Decimal(
                data.administrativa.valor_depreciado
              ),
              vida_util_restante: data.administrativa.vida_util_restante,
            },
          },
        },
        include: {
          categorias: true,
          marcas: true,
          especificaciones: true,
          seguridad: true,
          adquisicion: true,
          administrativa: true,
          estado_ubicacion: {
            include: {
              sucursales: {
                include: {
                  sedes: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      console.error("Error al crear el equipo:", error);
      throw new Error(
        "Error al crear el equipo. Verifique los datos ingresados."
      );
    }
  },
  async update(data) {
    const equipoId = Number(data.id_equipo);
    const categoriaId = Number(data.categoria_id);
    const marcaId = Number(data.marca_id);
    const sucursalId = Number(data.sucursal_id);

    if ([categoriaId, marcaId, sucursalId, equipoId].some(isNaN)) {
      throw new Error("ID de categoría, marca, sucursal o equipo inválido.");
    }

    return await prisma.equipos.update({
      where: { id_equipo: equipoId },
      data: {
        nombre_equipo: data.nombre_equipo,
        nro_serie: data.nro_serie,
        estado_actual: data.estado_actual,
        modelo: data.modelo,
        tipo_activo: data.tipo_activo,
        fecha_registro: new Date(data.fecha_registro),
        garantia_fecha_fin: new Date(data.garantia_fecha_fin),
        observaciones: data.observaciones,

        // Relaciones con FK
        categorias: {
          connect: { id_categoria: categoriaId },
        },
        marcas: {
          connect: { id_marca: marcaId },
        },
        sucursales: {
          connect: { id_sucursal: sucursalId },
        },

        // Relaciones 1:1 con update anidado
        especificaciones: {
          update: {
            where: {
              id_especificacion: data.especificaciones.id_especificacion,
            },
            data: {
              procesador: data.especificaciones.procesador,
              memoria_ram: data.especificaciones.memoria_ram,
              almacenamiento: data.especificaciones.almacenamiento,
              tarjeta_grafica: data.especificaciones.tarjeta_grafica,
              pantalla: data.especificaciones.pantalla,
              sistema_operativo: data.especificaciones.sistema_operativo,
              bateria: data.especificaciones.bateria,
              puertos: data.especificaciones.puertos,
            },
          },
        },

        seguridad: {
          update: {
            where: {
              id_seguridad: data.seguridad.id_seguridad,
            },
            data: {
              nivel_acceso: data.seguridad.nivel_acceso,
              software_seguridad: data.seguridad.software_seguridad,
              cifrado_disco: data.seguridad.cifrado_disco,
              politicas_aplicadas:
                data.seguridad.politicas_aplicadas.join(", "),
            },
          },
        },

        adquisicion: {
          update: {
            where: {
              id_adquisicion: data.adquisicion.id_adquisicion,
            },
            data: {
              orden_compra: data.adquisicion.orden_compra,
              fecha_compra: new Date(data.adquisicion.fecha_compra),
              precio_compra: data.adquisicion.precio_compra,
              forma_pago: data.adquisicion.forma_pago,
              plazo_pago: data.adquisicion.plazo_pago,
              numero_factura: data.adquisicion.numero_factura,
              proveedor: data.adquisicion.proveedor,
            },
          },
        },

        administrativa: {
          update: {
            where: {
              id_admin: data.administrativa.id_admin,
            },
            data: {
              codigo_inventario: data.administrativa.codigo_inventario,
              centro_coste: data.administrativa.centro_coste,
              autorizado_por: data.administrativa.autorizado_por,
              fecha_activacion: new Date(data.administrativa.fecha_activacion),
              estado_contable: data.administrativa.estado_contable,
              valor_depreciado: new Prisma.Decimal(
                data.administrativa.valor_depreciado
              ),
              vida_util_restante: data.administrativa.vida_util_restante,
            },
          },
        },
      },
      include: {
        categorias: true,
        marcas: true,
        sucursales: true,
        especificaciones: true,
        seguridad: true,
        adquisicion: true,
        administrativa: true,
      },
    });
  },
  async findAll() {
    return await prisma.equipos.findMany({
      where: {
        estado_ubicacion: {
          none: {
            OR: [{ estado_actual: "Fuera de servicio" }],
          },
        },
      },
      include: {
        marcas: true,
        categorias: true,
        estado_ubicacion: {
          include: {
            sucursales: {
              include: {
                sedes: true,
                sedes: {
                  include: {
                    usuario_sede: {
                      include: {
                        usuarios: true,
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
  },
  async findById(nro_serie) {
    const equipo = await prisma.equipos.findUnique({
      where: { nro_serie },
      include: {
        marcas: true,
        categorias: true,
        especificaciones: true,
        seguridad: true,
        adquisicion: true,
        administrativa: true,
        perifericos: true,
        estado_ubicacion: {
          include: {
            sucursales: {
              include: {
                sedes: true,
                sedes: {
                  include: {
                    usuarios: {
                      select: {
                        id_usuario: true,
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

    if (!equipo) {
      throw new Error("No se encontró el equipo.");
    }

    return equipo;
  },
  async delete_(id) {
    const equipo_id = Number(id);
    try {
      const equipoUpdate = await prisma.equipos.update({
        where: { id_equipo: equipo_id },
        data: { estado_actual: "Fuera de servicio" },
      });

      const perifericosUpdate = await prisma.perifericos.updateMany({
        where: { equipo_asociado_id: equipo_id },
        data: { estado: "Fuera de servicio" },
      });

      return { equipoUpdate, perifericosUpdate };
    } catch (error) {
      throw new Error(error.message);
    }
  },
  async getTrazabilidadByEquipoId(id_equipo) {
    const equipoId = Number(id_equipo);
    try {
      const equipo = await prisma.equipos.findUnique({
        where: { id_equipo: equipoId },
        include: {
          prestamo_equipos: {
            include: {
              prestamos: {
                include: {
                  actas: true,
                  usuarios_prestamos_responsable_salida_idTousuarios: {
                    select: { nombre: true },
                  },
                },
              },
            },
          },
          traslados_equipos: {
            include: {
              traslados: {
                include: {
                  actas: true,
                  sucursales: {
                    include: {
                      sedes: {
                        include: {
                          usuarios: {
                            select: { nombre: true },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
          bajas_equipos: {
            include: {
              bajas: {
                include: {
                  actas: true,
                  usuarios_bajas_responsable_autorizacion_idTousuarios: {
                    select: { nombre: true },
                  },
                  usuarios_bajas_responsable_solicitud_idTousuarios: {
                    select: { nombre: true },
                  },
                },
              },
            },
          },
          mantenimientos: {
            include: {
              usuarios: {
                select: { nombre: true },
              },
            },
          },
        },
      });

      // Obtener devoluciones relacionadas por préstamo o traslado
      const devoluciones = await prisma.devoluciones.findMany({
        where: {
          OR: [
            {
              prestamos: {
                prestamo_equipos: {
                  some: {
                    equipo_id: equipoId,
                  },
                },
              },
            },
            {
              traslados: {
                traslados_equipos: {
                  some: {
                    equipo_id: equipoId,
                  },
                },
              },
            },
          ],
        },
        include: {
          actas: true,
          usuarios_devoluciones_usuario_entrega_idTousuarios: {
            select: { nombre: true },
          },
          usuarios_devoluciones_usuario_recibe_idTousuarios: {
            select: { nombre: true },
          },
          prestamos: {
            include: {
              usuarios_prestamos_responsable_salida_idTousuarios: {
                select: { nombre: true },
              },
              actas: true,
            },
          },
          traslados: {
            include: {
              sucursales: {
                include: {
                  sedes: {
                    include: {
                      usuarios: {
                        select: { nombre: true },
                      },
                    },
                  },
                },
              },
              actas: true,
            },
          },
        },
      });

      return {
        ...equipo,
        devoluciones,
      };
    } catch (error) {
      console.error("Error en getTrazabilidadByEquipoId:", error);
      throw new Error(
        error.message || "Error al obtener la trazabilidad del equipo."
      );
    }
  },
};
