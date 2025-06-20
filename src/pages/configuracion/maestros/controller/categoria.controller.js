import { CategoriaService } from "../services/categoria.service.js";

export const getAll = async (req, res) => {
  try {
    const categorias = await CategoriaService.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error getting all categorias" });
  }
};

export const getById = async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = await CategoriaService.findById(id);
    res.status(200).json(categoria);
  } catch (error) {
    res.status(500).json({ error: "Error finding categoria by id" });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const categoria = req.body;
    const updatedCategoria = await CategoriaService.update(id, categoria);
    res.status(200).json({ updatedCategoria, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error updating categoria" });
  }
};

export const create = async (req, res) => {
  try {
    const categoria = req.body;
    const createdCategoria = await CategoriaService.create(categoria);
    res.status(200).json({ success: true, createdCategoria });
  } catch (error) {
    res.status(500).json({ error: "Error creating categoria" });
  }
};

export const deleteC = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedCategoria = await CategoriaService.delete(id);
    res.status(200).json({ deletedCategoria, success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
