import { prisma } from "../../../prisma/prismaCliente.js";

export const ProveedorModel = {
  async getAll() {
    const proveedores = await prisma.proveedores.findMany();
    return proveedores;
  },
  async create(data) {
    try {
      const exists = await prisma.proveedores.findFirst({
        where: { nombre: data.nombre },
      });

      if (exists) {
        throw new Error("Ya existe un proveedor con ese nombre.");
      }

      const proveedor = await prisma.proveedores.create({
        data: {
          tipo_proveedor: data.tipo_proveedor,
          nombre: data.nombre,
          identificacion: data.identificacion,
          contacto: data.contacto,
          telefono: data.telefono,
          correo: data.correo,
          direccion: data.direccion,
          sitio_web: data.sitio_web,
        },
      });
      return proveedor;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  async findByName(name) {
    try {
      const proveedor = await prisma.proveedores.findMany({
        where: {
          OR: [
            {
              nombre: {
                contains: name,
                mode: "insensitive",
              },
            },
          ],
        },
        select: {
          id_proveedor: true,
          nombre: true,
          tipo_proveedor: true,
          identificacion: true,
          contacto: true,
          telefono: true,
          correo: true,
          direccion: true,
          sitio_web: true,
        },
        take: 10,
      });
      return proveedor;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
};
