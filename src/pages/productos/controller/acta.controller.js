import { actaService } from "../services/acta.service.js";

export const getActas = async (req, res) => {
  try {
    const actas = await actaService.findAll();
    res.status(200).json(actas);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, newStatus, tipo } = req.body;
    const updatedActa = await actaService.update(id, newStatus, tipo);
    res.status(200).json({ updatedActa, success: true });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
