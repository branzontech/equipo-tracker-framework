import { PrestamoService } from "../services/prestamo.service.js";

export const createPrestamo = async (req, res) => {
  try {
    const prestamo = req.body;
    const prestamoCreado = await PrestamoService.create(prestamo);
    res.status(200).json({ prestamoCreado, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error creating prestamo" });
  }
};

export const getPrestamos = async (req, res) => {
  try {
    const prestamos = await PrestamoService.getAll();
    res.status(200).json(prestamos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const saveSign = async (req, res) => {
  try {
    const {
      firma_entrega,
      firma_salida,
      responsable_salida_id,
      responsable_entrada_id,
    } = req.body;
    const updatedPrestamo = await PrestamoService.saveSign(
      firma_entrega,
      firma_salida,
      responsable_salida_id,
      responsable_entrada_id
    );
    res.status(200).json({ updatedPrestamo, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error saving sign" });
  }
};