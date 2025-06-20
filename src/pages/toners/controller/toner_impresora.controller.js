import { tonerImpresoraService } from "../services/toner_impresora.service.js";

export const getAll = async (req, res) => {
  try {
    const tonerImpresora = await tonerImpresoraService.getAll();
    res.status(200).json({ tonerImpresora });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};