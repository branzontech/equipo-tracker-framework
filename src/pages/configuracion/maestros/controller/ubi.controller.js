import { UbiService } from "../services/ubicaciones.service.js";

export const getUbi = async (req, res) => {
  try {
    const ubicaciones = await UbiService.findAll();

    if (!ubicaciones || ubicaciones.length === 0) {
      return res.status(404).json({ error: "No ubicaciones found" });
    }

    res.json({ success: true, ubicaciones });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const createUbi = async (req, res) => {
  try {
    const ubicacion = req.body;
    const ubicacionCreated = await UbiService.create(ubicacion);
    res.status(201).json({ success: true, ubicacion: ubicacionCreated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUbi = async (req, res) => {
  try {
    const id = req.params.id;
    const ubicacionDeleted = await UbiService.delete(id);
    res.json({ success: true, ubicacion: ubicacionDeleted });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
