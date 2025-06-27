import { perfilesAccesoService } from "../services/perfilesAcceso.service.js";

export const createPerfilesAcceso = async (req, res) => {
  try {
    const perfilesAcceso = await perfilesAccesoService.create(req.body);
    res.status(201).json({ perfilesAcceso, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findAllPerfilesAcceso = async (req, res) => {
  try {
    const perfilesAcceso = await perfilesAccesoService.findAll();
    res.status(200).json(perfilesAcceso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getByIdPerfilesAcceso = async (req, res) => {
  try {
    const perfilesAcceso = await perfilesAccesoService.getById(req.params.id);
    res.status(200).json(perfilesAcceso);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updatePerfilesAcceso = async (req, res) => {
  try {
    const perfilesAcceso = await perfilesAccesoService.update(req.body);
    res.status(200).json({ perfilesAcceso, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deletePerfilesAcceso = async (req, res) => {
  try {
    const perfilesAcceso = await perfilesAccesoService.detele(req.params.id);
    res.status(200).json({ perfilesAcceso, success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};