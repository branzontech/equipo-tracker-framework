import { manteService } from "../services/mante.service.js";

export const getAll = async (req, res) => {
  try {
    const mantes = await manteService.getAll();
    res.status(200).json(mantes);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las mantenimientos" });
  }
};

export const getById = async (req, res) => {
  try {
    const mante = await manteService.getById(req.params.id);
    res.status(200).json(mante);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la mantenimiento" });
  }
};

export const createM = async (req, res) => {
  try {
    const mante = await manteService.create(req.body);
    res.status(201).json({ success: true, mante });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la mantenimiento" });
  }
};

export const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const mante = await manteService.updateStatus(id, status);
    res.status(200).json({ success: true, mante });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la mantenimiento" });
  }
};

export const uploadFiles = async (req, res) => {
  const { id } = req.params;
  const files = req.files;
  try {
    const mante = await manteService.uploadFiles(id, files);
    res.status(200).json({ success: true, mante });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la mantenimiento" });
  }
};

export const getFiles = async (req, res) => {
  try {
    const files = await manteService.getFiles();
    res.status(200).json(files);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los archivos" });
  }
};

export const delete_ = async (req, res) => {
  try {
    const mante = await manteService.delete(req.params.id);
    res.status(200).json(mante);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la mantenimiento" });
  }
};
