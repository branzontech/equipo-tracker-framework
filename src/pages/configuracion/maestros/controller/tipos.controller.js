import { tiposService } from "../services/tipos.service.js";

export const createTipo = async (req, res) => {
  try {
    const tipo = req.body;
    const nuevoTipo = await tiposService.create(tipo);
    res.status(200).json({ nuevoTipo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getTipoById = async (req, res) => {
  try {
    const id = req.params.id;
    const tipo = await tiposService.getById(id);
    res.status(200).json(tipo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllTipos = async (req, res) => {
  try {
    const tipos = await tiposService.getAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTipo = async (req, res) => {
  try {
    const id = req.params.id;
    const tipo = req.body;
    const updatedTipo = await tiposService.update(id, tipo);
    res.status(200).json({ updatedTipo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTipo = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedTipo = await tiposService.delete(id);
    res.status(200).json({ deletedTipo, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
