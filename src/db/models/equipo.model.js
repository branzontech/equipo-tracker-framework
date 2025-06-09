import { Prisma } from "@prisma/client";
import { prisma } from "../../../prisma/prismaCliente.js";

export const equipoModel = {
  async create(data) {
    const categoriaId = Number(data.categoria_id);
    const marcaId = Number(data.marca_id);
    const sucursalId = Number(data.sucursal_id);

    if ([categoriaId, marcaId, sucursalId].some(isNaN)) {
      throw new Error("ID de categoría, marca o sucursal inválido.");
    }

    return await prisma.equipos.create({
      data: {
        nombre_equipo: data.nombre_equipo,
        nro_serie: data.nro_serie,
        estado_actual: data.estado_actual,
        modelo: data.modelo,
        tipo_activo: data.tipo_activo,
        fecha_registro: new Date(data.fecha_registro),
        garantia_fecha_fin: new Date(data.garantia_fecha_fin),
        observaciones: data.observaciones,

        // Relaciones con otras tablas (FKs)
        categorias: {
          connect: { id_categoria: categoriaId },
        },
        marcas: {
          connect: { id_marca: marcaId },
        },
        sucursales: {
          connect: { id_sucursal: sucursalId },
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
          },
        },

        seguridad: {
          create: {
            nivel_acceso: data.seguridad.nivel_acceso,
            software_seguridad: data.seguridad.software_seguridad,
            cifrado_disco: data.seguridad.cifrado_disco,
            politicas_aplicadas: data.seguridad.politicas_aplicadas,
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
            proveedor: data.adquisicion.proveedor,
          },
        },

        administrativa: {
          create: {
            codigo_inventario: data.informacionAdministrativa.codigo_inventario,
            centro_coste: data.informacionAdministrativa.centro_coste,
            autorizado_por: data.informacionAdministrativa.autorizado_por,
            fecha_activacion: new Date(
              data.informacionAdministrativa.fecha_activacion
            ),
            estado_contable: data.informacionAdministrativa.estado_contable,
            valor_depreciado: new Prisma.Decimal(
              data.informacionAdministrativa.valor_depreciado
            ),
            vida_util_restante:
              data.informacionAdministrativa.vida_util_restante,
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
      include: {
        marcas: true,
        categorias: true,
        sucursales: true,
        sucursales: {
          include: {
            sedes: true,
            sedes: {
              include: {
                usuarios: true,
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
        sucursales: true,
        sucursales: {
          include: {
            sedes: true,
            sedes: {
              include: {
                usuarios: true,
              },
            },
          },
        },
        especificaciones: true,
        seguridad: true,
        adquisicion: true,
        administrativa: true,
      },
    });

    if (!equipo) {
      throw new Error("No se encontró el equipo.");
    }

    return equipo;
  },
  async delete_(id) {
    const equipo_id = Number(id);
    await prisma.especificaciones.deleteMany({ where: { equipo_id: equipo_id } });
    await prisma.seguridad.deleteMany({ where: { equipo_id: equipo_id } });
    await prisma.adquisicion.deleteMany({ where: { equipo_id: equipo_id } });
    await prisma.administrativa.deleteMany({ where: { equipo_id: equipo_id } });

    const delete_E = await prisma.equipos.delete({
      where: { id_equipo: equipo_id },
    });

    return delete_E;
  },
};
