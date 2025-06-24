import { actaService } from "../services/acta.service.js";

export const getActas = async (req, res) => {
  try {
    const actas = await actaService.findAll();
    res.status(200).json(actas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInfoEquipo = async (req, res) => {
  try {
    const { nro_serie } = req.params;
    const infoEquipo = await actaService.getInfoEquipo(nro_serie);
    res.status(200).json(infoEquipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInfoPerifericos = async (req, res) => {
  try {
    const { serial } = req.params;
    const infoPeriferico = await actaService.getInfoPeriferico(serial);
    res.status(200).json(infoPeriferico);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInfoImpresoras = async (req, res) => {
  try {
    const { serial } = req.params;
    const infoImpresora = await actaService.getInfoImpresora(serial);
    res.status(200).json(infoImpresora);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStatus = async (req, res) => {
  try {
    const { id, newStatus, tipo, acta_equipos } = req.body;
    const updatedActa = await actaService.update(id, newStatus, tipo, acta_equipos);
    res.status(200).json({ updatedActa, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
