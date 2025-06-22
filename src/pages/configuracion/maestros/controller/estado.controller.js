import { estadoService } from "../services/estado.service.js";

export const createEstado = async (req, res) => {
  try {
    const estado = req.body;
    const nuevoEstado = await estadoService.create(estado);
    res.status(200).json({ nuevoEstado, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllEstados = async (req, res) => {
  try {
    const estados = await estadoService.getAll();
    res.status(200).json(estados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
