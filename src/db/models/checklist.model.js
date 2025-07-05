import { prisma } from "../../../prisma/prismaCliente.js";

export const checklistModel = {
  async createChecklist(data) {
    const idUser = Number(data.creado_por);
    try {
      const checklist = await prisma.checklist_plantillas.create({
        data: {
          nombre: data.nombre,
          tipo_equipo: data.tipo_equipo,
          tipo_calificacion: data.tipo_calificacion,
          campos: data.campos,
          usuarios: {
            connect: {
              id_usuario: idUser,
            },
          },
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al crear checklist", error);
      throw error;
    }
  },
  async get() {
    try {
      const checklist = await prisma.checklist_plantillas.findMany({
        select: {
          id_plantilla: true,
          nombre: true,
          tipo_equipo: true,
          tipo_calificacion: true,
          campos: true,
          usuarios: {
            select: {
              id_usuario: true,
              nombre: true,
            },
          },
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al obtener checklist", error);
      throw error;
    }
  },
};
