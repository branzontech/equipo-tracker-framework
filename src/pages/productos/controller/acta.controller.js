import { actaService } from "../services/acta.service.js";

export const getActas = async (req, res) => {
  try {
    const actas = await actaService.findAll();
    res.status(200).json(actas);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
