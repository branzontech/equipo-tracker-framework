import e from "express";
import SedesService from "../services/sedes.service.js";

export const getSedes = async (req, res) => {
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

export const getSedeById = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = await SedesService.findById(id);

    if (!sede) {
      return res.status(404).json({ error: "Sede not found" });
    }

    res.json({ success: true, sede });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const createSede = async (req, res) => {
  try {
    const sede = req.body;

    const sedeCreated = await SedesService.create(sede);
    res.status(201).json({ success: true, sede: sedeCreated });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const deleteSede = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSede = await SedesService.delete(id);
    res.json({ success: true, deletedSede });
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

export const updateSede = async (req, res) => {
  try {
    const { id } = req.params;
    const sede = req.body;

    const updatedSede = await SedesService.update(id, sede);
    res.json({ success: true, updatedSede });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
