import { MarcasService } from "../services/marcas.service.js";

export const getAll = async (req, res) => {
  try {
    const marcas = await MarcasService.getAll();
    res.status(200).json(marcas);
  } catch (error) {
    res.status(500).json({ error: "Error getting all marcas" });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const marca = await MarcasService.findById(id);
    res.status(200).json(marca);
  } catch (error) {
    res.status(500).json({ error: "Error finding marca by id" });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const marca = req.body;
    const updatedMarca = await MarcasService.update(id, marca);
    res.status(200).json({ updatedMarca, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating marca" });
  }
};

export const create = async (req, res) => {
  try {
    const marca = req.body;
    const createdMarca = await MarcasService.create(marca);
    res.status(201).json({ success: true, createdMarca });
  } catch (error) {
    res.status(500).json({ error: "Error creating marca" });
  }
};

export const deleteM = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedMarca = await MarcasService.delete(id);
    res.status(200).json({ deletedMarca, success: true });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
