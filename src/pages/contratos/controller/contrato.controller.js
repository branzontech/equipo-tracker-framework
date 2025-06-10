import { contratoService } from "../services/contrato.service.js";

export const createContrato = async (req, res) => {
  try {
    const contrato = req.body;
    const contratoCreado = await contratoService.create(contrato);
    res.status(201).json({ contratoCreado, success: true });
  } catch (error) {
    res.status(500).json({ error: "Error creating contrato" });
  }
};

export const getContratos = async (req, res) => {
  try {
    const contratos = await contratoService.findAll();
    res.status(200).json(contratos);
  } catch (error) {
    res.status(500).json({ error: "Error getting all contratos" });
  }
};
