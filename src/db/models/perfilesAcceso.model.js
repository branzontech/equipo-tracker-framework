import { prisma } from "../../../prisma/prismaCliente.js";

export const PerfilesAccesoModel = {
  async create(data) {
    try {
      return await prisma.perfilesacceso.create({
        data: {
          nombre_perfil: data.nombre_perfil,
          descripcion: data.descripcion,
        },
      });
    } catch (error) {
      console.error("Error al crear el perfil de acceso:", error);
      throw new Error("Error al crear el perfil de acceso: " + error.message);
    }
  },
  async findAll() {
    const perfilesAcceso = await prisma.perfilesacceso.findMany({
      select: {
        id: true,
        nombre_perfil: true,
        descripcion: true,
        fecha_creacion: true,
      },
    });
    return perfilesAcceso;
  },
  async getById(id) {
    const id_perfil = Number(id);
    const perfilAcceso = await prisma.perfilesacceso.findUnique({
      where: { id: id_perfil },
      select: {
        id: true,
        nombre_perfil: true,
        descripcion: true,
        fecha_creacion: true,
      },
    });
    return perfilAcceso;
  },
  async update(perfilAcceso) {
    const perfilAccesoUpdated = await prisma.perfilesacceso.update({
      where: { id: perfilAcceso.id },
      data: {
        nombre_perfil: perfilAcceso.nombre_perfil,
        descripcion: perfilAcceso.descripcion,
      },
    });
    return perfilAccesoUpdated;
  },
};
