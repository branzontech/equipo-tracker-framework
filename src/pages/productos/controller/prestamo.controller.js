import { PrestamoService } from "../services/prestamo.service.js";

export const createPrestamo = async (req, res) => {
  try {
    const prestamo = req.body;
    const prestamoCreado = await PrestamoService.create(prestamo);
    res.status(201).json({ prestamoCreado, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error creating prestamo" });
  }
};

export const getPrestamos = async (req, res) => {
  try {
    const prestamos = await PrestamoService.findAll();
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: "Error getting all prestamos" });
  }
};
