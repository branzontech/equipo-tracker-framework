import { bajaService } from "../services/baja.service.js";

export const getAllBajas = async (req, res) => {
  try {
    const bajas = await bajaService.findAll();
    res.status(200).json(bajas);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener las bajas" });
  }
};

export const createBaja = async (req, res) => {
  try {
    const baja = req.body;
    const createdBaja = await bajaService.create(baja);
    res.status(201).json({ success: true, createdBaja });
  } catch (error) {
    res.status(500).json({ error: "Error al crear la baja" });
  }
};
