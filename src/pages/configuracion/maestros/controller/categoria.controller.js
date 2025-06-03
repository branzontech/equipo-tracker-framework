import { CategoriaService } from "../services/categoria.service.js";

export const getAll = async (req, res) => {
  try {
    const categorias = await CategoriaService.getAll();
    res.status(200).json(categorias);
  } catch (error) {
    res.status(500).json({ error: "Error getting all categorias" });
  }
};

export const create = async (req, res) => {
  try {
    const categoria = req.body;
    const createdCategoria = await CategoriaService.create(categoria);
    res.status(201).json({ success: true, createdCategoria });
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
    res.status(500).json({ error: "Error deleting categoria" });
  }
};
