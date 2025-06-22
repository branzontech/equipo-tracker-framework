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

export const getAllTipos = async (req, res) => {
  try {
    const tipos = await tiposService.getAll();
    res.status(200).json(tipos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
