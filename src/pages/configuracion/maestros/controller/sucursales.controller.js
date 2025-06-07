import { SucursalService } from "../services/sucursales.service.js";

export const getSucursal = async (req, res) => {
  try {
    const sucursales = await SucursalService.findAll();

    if (!sucursales || sucursales.length === 0) {
      return res.status(404).json({ error: "No sucursales found" });
    }

    res.json({ success: true, sucursales });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const getSucursalById = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = await SucursalService.findById(id);

    if (!sucursal) {
      return res.status(404).json({ error: "Sucursal not found" });
    }

    res.json({ success: true, sucursal });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

export const updateSucursal = async (req, res) => {
  try {
    const { id } = req.params;
    const sucursal = req.body;

    const sucursalUpdated = await SucursalService.update(id, sucursal);
    res.json({ success: true, sucursal: sucursalUpdated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createSucursal = async (req, res) => {
  try {
    const sucursal = req.body;
    const sucursalCreated = await SucursalService.create(sucursal);
    res.status(201).json({ success: true, sucursal: sucursalCreated });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSucursal = async (req, res) => {
  try {
    const id = req.params.id;
    const sucursalDeleted = await SucursalService.delete(id);
    res.json({ success: true, sucursal: sucursalDeleted });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
