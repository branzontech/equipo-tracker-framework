import { trasladoServices } from "../services/traslado.service.js";

export const getAll = async (req, res) => {
  try {
    const traslados = await trasladoServices.findAll();
    res.status(200).json(traslados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los traslados" });
  }
};

export const create = async (req, res) => {
  try {
    const traslado = req.body;
    const createdTraslado = await trasladoServices.create(traslado);
    res.status(201).json({ createdTraslado, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error al crear el traslado" });
  }
};
