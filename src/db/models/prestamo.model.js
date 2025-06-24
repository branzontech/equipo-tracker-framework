import { prisma } from "../../../prisma/prismaCliente.js";

export const prestamoModel = {
  async findAll() {
    const prestamos = await prisma.prestamos.findMany({
      include: {
        actas: {
          select: {
            tipo: true,
            fecha: true,
          },
        },
        usuarios_prestamos_responsable_entrada_idTousuarios: {
          select: {
            id_usuario: true,
            nombre: true,
          },
        },
        usuarios_prestamos_responsable_salida_idTousuarios: {
          select: {
            id_usuario: true,
            nombre: true,
          },
        },
        prestamo_equipos: {
          include: {
            equipos: {
              select: {
                id_equipo: true,
                nombre_equipo: true,
              },
            },
            prestamo_perifericos: {
              include: {
                perifericos: {
                  select: {
                    id_periferico: true,
                    nombre: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return prestamos;
  },
  async create(prestamo) {
    try {
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);

      // 1. Crear el acta
      const nuevaActa = await prisma.actas.create({
        data: {
          tipo: "Prestamo",
          fecha: hoy,
        },
      });

      // 2. Crear el préstamo y asociar usuarios
      const nuevoPrestamo = await prisma.prestamos.create({
        data: {
          fecha_salida: new Date(prestamo.fecha_salida),
          fecha_retorno: new Date(prestamo.fecha_retorno),
          descripcion: prestamo.descripcion,
          estado: prestamo.estado,
          actas: { connect: { id_acta: nuevaActa.id_acta } },
          usuarios_prestamos_responsable_salida_idTousuarios: {
            connect: { id_usuario: prestamo.responsable_salida_id },
          },
          usuarios_prestamos_responsable_entrada_idTousuarios: {
            connect: { id_usuario: prestamo.responsable_entrada_id },
          },
        },
      });

      // 3. Iterar por equipos del préstamo
      for (const equipo of prestamo.equipos) {
        // 3.1 Crear relación en Prestamo_Equipos
        const prestamoEquipo = await prisma.prestamo_equipos.create({
          data: {
            prestamo_id: nuevoPrestamo.id_prestamo,
            equipo_id: equipo.id_equipo,
          },
        });

        // 3.1.1 Actualizar el estado del equipo a "En préstamo"
        await prisma.estado_ubicacion.updateMany({
          where: { equipo_id: equipo.id_equipo },
          data: {
            estado_actual: "En Préstamo",
          },
        });

        await prisma.perifericos.updateMany({
          where: { equipo_asociado_id: equipo.id_equipo },
          data: { estado: "En Préstamo" },
        });

        // 3.2 Insertar perifericos relacionados (si hay)
        if (equipo.perifericos && equipo.perifericos.length > 0) {
          for (const periferico_id of equipo.perifericos) {
            try {
              await prisma.prestamo_perifericos.create({
                data: {
                  prestamo_equipo_id: prestamoEquipo.id,
                  periferico_id,
                },
              });
            } catch (error) {
              console.error(
                `❌ Error insertando periférico ${periferico_id}:`,
                error
              );
            }
          }
        }
      }

      if (prestamo.perifericos_directos?.length > 0) {
        for (const periferico_id of prestamo.perifericos_directos) {
          await prisma.prestamo_perifericos_directos.create({
            data: {
              prestamo_id: nuevoPrestamo.id_prestamo,
              periferico_id,
            },
          });

          // Actualizar estado del periférico
          await prisma.perifericos.update({
            where: { id_periferico: periferico_id },
            data: { estado: "En Préstamo" },
          });
        }
      }

      // if (prestamo.impresoras?.length > 0) {
      //   for (const impresora_id of prestamo.impresoras) {
      //     await prisma.prestamo_impresoras.create({
      //       data: {
      //         prestamo_id: nuevoPrestamo.id_prestamo,
      //         impresora_id,
      //       },
      //     });

      //     // Actualizar estado de la impresora
      //     await prisma.impresoras.update({
      //       where: { id_impresora: impresora_id },
      //       data: { estado: "En Préstamo" }, // IMPRESORA NO TIENE ESTADO
      //     });
      //   }
      // }

      return nuevoPrestamo;
    } catch (error) {
      console.error("Error al crear el préstamo:", error);
      return error;
    }
  },
  async saveSign(
    firma_entrega,
    firma_salida,
    responsable_salida_id,
    responsable_entrada_id
  ) {
    try {
      if (firma_entrega && responsable_salida_id) {
        const firmaBuffer = Buffer.from(firma_entrega.split(",")[1], "base64");

        await prisma.usuarios.update({
          where: { id_usuario: responsable_salida_id },
          data: { firma: firmaBuffer },
        });
      }

      if (firma_salida && responsable_entrada_id) {
        const firmaBuffer = Buffer.from(firma_salida.split(",")[1], "base64");

        await prisma.usuarios.update({
          where: { id_usuario: responsable_entrada_id },
          data: { firma: firmaBuffer },
        });
      }
    } catch (error) {
      console.error("Error al guardar la firma del prestamo:", error);
      return error;
    }
  },
};
