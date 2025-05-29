import SedesService from "../services/sedes.service.js";

const getSedes = async (req, res) => {
  try {
    const sedes = await SedesService.findAll();

    if (!sedes || sedes.length === 0) {
      return res.status(404).json({ error: "No sedes found" });
    }

    res.json({ success: true, sedes });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export default getSedes;
