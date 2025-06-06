import impresoraService from "../services/impresora.service.js";

export const getAll = async (req, res) => {
  try {
    const impresoras = await impresoraService.getAll();
    res.status(200).json(impresoras);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getById = async (req, res) => {
  try {
    const impresora = await impresoraService.getById(req.params.id);
    res.status(200).json(impresora);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la impresora" });
  }
};

export const createImpresora = async (req, res) => {
  try {
    const impresora = req.body;
    console.log("Recibido:", impresora);

    const impresoraCreated = await impresoraService.create(impresora);
    res.status(201).json({ success: true, impresoraCreated });
  } catch (error) {
    console.error("Error creando impresora:", error);
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const impresora = req.body;
    const impresoraUpdated = await impresoraService.update(impresora);
    res.status(200).json(impresoraUpdated);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar la impresora" });
  }
};

export const delete_ = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedImpresora = await impresoraService.delete(id);
    res.status(200).json(deletedImpresora);
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar la impresora" });
  }
};
