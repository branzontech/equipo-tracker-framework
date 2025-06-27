import { tonersService } from "../services/toners.service.js";

export const getAll = async (req, res) => {
  try {
    const toners = await tonersService.getAll();
    res.status(200).json(toners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const toner = await tonersService.getById(req.params.id);
    res.status(200).json(toner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createToner = async (req, res) => {
  try {
    const toner = req.body;
    const tonerCreated = await tonersService.create(toner);
    res.status(201).json({ success: true, tonerCreated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateToner = async (req, res) => {
  try {
    const toner = req.body;
    const updatedToner = await tonersService.update(toner);
    res.status(200).json({ updatedToner, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteToner = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedToner = await tonersService.delete(id);
    res.status(200).json({ deletedToner, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getBySerial = async (req, res) => {
  try {
    const { serial } = req.params;
    const toner = await tonersService.getBySerial(serial);
    res.status(200).json(toner);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el toner" });
  }
};

export const createSalidaToner = async (req, res) => {
  try {
    const salidaToner = req.body;
    const salidaTonerCreated = await tonersService.createSalidaToner(salidaToner);
    res.status(201).json({ success: true, salidaTonerCreated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};