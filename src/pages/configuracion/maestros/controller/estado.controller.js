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

export const getEstadoById = async (req, res) => {
  try {
    const id = req.params.id;
    const estado = await estadoService.getById(id);
    res.status(200).json(estado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateEstado = async (req, res) => {
  try {
    const id = req.params.id;
    const estado = req.body;
    const updatedEstado = await estadoService.update(id, estado);
    res.status(200).json({ updatedEstado, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
