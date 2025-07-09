import { checklistService } from "../services/checklis.service.js";

export const createChecklist = async (req, res) => {
  try {
    const { nombre, tipo_equipo, tipo_calificacion, campos, creado_por } =
      req.body;
    const checklist = await checklistService.createChecklist({
      nombre,
      tipo_equipo,
      tipo_calificacion,
      campos,
      creado_por,
    });
    res.status(200).json({ checklist, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la plantilla de chequeo" });
  }
};

export const getChecklist = async (req, res) => {
  try {
    const checklist = await checklistService.getChecklist();
    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la plantilla de chequeo" });
  }
};

export const getChecklistById = async (req, res) => {
  try {
    const { id } = req.params;
    const checklist = await checklistService.getChecklistById(id);
    res.status(200).json(checklist);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la plantilla de chequeo" });
  }
};

export const updateChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, tipo_equipo, tipo_calificacion, campos } = req.body;
    const checklist = await checklistService.updateChecklist(id, {
      nombre,
      tipo_equipo,
      tipo_calificacion,
      campos,
    });
    res.status(200).json({ checklist, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al actualizar la plantilla de chequeo" });
  }
};

export const disableChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const checklist = await checklistService.disableChecklist(id);
    res.status(200).json({ checklist, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al deshabilitar la plantilla de chequeo" });
  }
};

export const enableChecklist = async (req, res) => {
  try {
    const { id } = req.params;
    const checklist = await checklistService.enableChecklist(id);
    res.status(200).json({ checklist, success: true });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error al habilitar la plantilla de chequeo" });
  }
};