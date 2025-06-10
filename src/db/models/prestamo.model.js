import { prisma } from "../../../prisma/prismaCliente.js";

export const prestamoModel = {
  async findAll() {
    const prestamos = await prisma.prestamos.findMany({
      select: {
        id_prestamo: true,
        acta_id: true,
        equipo_id: true,
        responsable_salida_id: true,
        responsable_entrada_id: true,
        ubicacion_destino_id: true,
        fecha_salida: true,
        fecha_retorno: true,
        estado: true,
      },
    });
    return prestamos;
  },
  async create(prestamo) {
    const data = {
      acta_id: prestamo.acta_id,
      equipo_id: prestamo.equipo_id,
      responsable_salida_id: prestamo.responsable_salida_id,
      responsable_entrada_id: prestamo.responsable_entrada_id,
      ubicacion_destino_id: prestamo.ubicacion_destino_id,
      fecha_salida: new Date(prestamo.fecha_salida),
      fecha_retorno: new Date(prestamo.fecha_retorno),
      estado: prestamo.estado,
    };

    return await prisma.prestamos.create({ data });
  },
};
