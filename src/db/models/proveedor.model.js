import { prisma } from "../../../prisma/prismaCliente.js";

export const ProveedorModel = {
  async getAll() {
    const proveedores = await prisma.proveedores.findMany();
    return proveedores;
  },
  async getById(id) {
    const id_proveedor = Number(id);
    const proveedor = await prisma.proveedores.findUnique({
      where: { id_proveedor: id_proveedor },
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
        estado: true,
      },
    });
    return proveedor;
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
          estado: data.estado,
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
          estado: true,
        },
        take: 10,
      });
      return proveedor;
    } catch (error) {
      console.log(error);
      throw new Error(error.message);
    }
  },
  async update(id, proveedor) {
    const id_proveedor = Number(id);
    try {
      const updatedProveedor = await prisma.proveedores.update({
        where: { id_proveedor },
        data: {
          nombre: proveedor.nombre,
          tipo_proveedor: proveedor.tipo_proveedor,
          identificacion: proveedor.identificacion,
          contacto: proveedor.contacto,
          telefono: proveedor.telefono,
          correo: proveedor.correo,
          direccion: proveedor.direccion,
          sitio_web: proveedor.sitio_web,
          estado: proveedor.estado,
        },
      });
      return updatedProveedor;
    } catch (error) {
      console.error("❌ Error al actualizar el proveedor:", error);
      return error;
    }
  },
  async delete_(id) {
    const id_proveedor = Number(id);
    try {
      const proveedorUpdate = await prisma.proveedores.update({
        where: { id_proveedor },
        data: { estado: "Fuera de servicio" },
      });

      return proveedorUpdate;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
