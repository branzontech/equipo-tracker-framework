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
