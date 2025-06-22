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
};
