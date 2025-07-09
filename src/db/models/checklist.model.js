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
          estado: "Habilitado",
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
          estado: true,
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al obtener checklist", error);
      throw error;
    }
  },
  async getById(id) {
    const checkId = Number(id);
    try {
      const checklist = await prisma.checklist_plantillas.findUnique({
        where: {
          id_plantilla: checkId,
        },
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
          estado: true,
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al obtener checklist", error);
      throw error;
    }
  },
  async updateChecklist(id, data) {
    const checkId = Number(id);
    try {
      const checklist = await prisma.checklist_plantillas.update({
        where: {
          id_plantilla: checkId,
        },
        data: {
          nombre: data.nombre,
          tipo_equipo: data.tipo_equipo,
          tipo_calificacion: data.tipo_calificacion,
          campos: data.campos,
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al actualizar checklist", error);
      throw error;
    }
  },
  async disableChecklist(id) {
    const checkId = Number(id);
    try {
      const checklist = await prisma.checklist_plantillas.update({
        where: {
          id_plantilla: checkId,
        },
        data: {
          estado: "Deshabilitado",
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al actualizar checklist", error);
      throw error;
    }
  },
  async enableChecklist(id) {
    const checkId = Number(id);
    try {
      const checklist = await prisma.checklist_plantillas.update({
        where: {
          id_plantilla: checkId,
        },
        data: {
          estado: "Habilitado",
        },
      });
      return checklist;
    } catch (error) {
      console.log("Error al actualizar checklist", error);
      throw error;
    }
  },
};
