import { MarcasService } from "../services/marcas.service.js";

export const getAll = async (req, res) => {
  try {
    const marcas = await MarcasService.getAll();
    res.status(200).json(marcas);
  } catch (error) {
    res.status(500).json({ error: "Error getting all marcas" });
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
    res.status(500).json({ error: "Error deleting marca" });
  }
};
