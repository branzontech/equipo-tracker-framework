import { devolucionService } from "../services/devolucion.service.js";

export const findAllDevoluciones = async (req, res) => {
  try {
    const devoluciones = await devolucionService.findAll();
    res.status(200).json(devoluciones);
  } catch (error) {
    console.error("Error fetching devoluciones:", error);
    res.status(500).json({ message: "Error fetching devoluciones" });
  }
};

export const findEquiposEnMovimiento = async (req, res) => {
  try {
    const equipos = await devolucionService.findEquiposEnMovimiento();
    res.status(200).json(equipos);
  } catch (error) {
    console.error("Error fetching equipos en movimiento:", error);
    res.status(500).json({ message: "Error fetching equipos en movimiento" });
  }
};

export const create = async (req, res) => {
  try {
    const devolucion = req.body;
    const devolucionCreated = await devolucionService.create(devolucion);
    res.status(200).json({ devolucionCreated, success: true });
  } catch (error) {
    console.error("Error creating devolucion:", error);
    res.status(500).json({ message: "Error creating devolucion" });
  }
};
