import { ProveedorService } from "../services/provedor.service.js";

export const getAllProveedores = async (req, res) => {
  try {
    const proveedores = await ProveedorService.getAll();
    res.status(200).json(proveedores);
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};

export const createProveedor = async (req, res) => {
  try {
    const proveedor = await ProveedorService.create(req.body);
    res.status(201).json({ proveedor, success: true });
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};

export const getProveedorByName = async (req, res) => {
  const { name } = req.params;
  try {
    const proveedor = await ProveedorService.findByName(name);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};

export const getProveedorById = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await ProveedorService.getById(id);
    res.status(200).json(proveedor);
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};

export const updateProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    const proveedor = await ProveedorService.update(id, req.body);
    res.status(200).json({ proveedor, success: true });
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};

export const deleteProveedor = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedProveedor = await ProveedorService.delete_(id);
    res.status(200).json({ deletedProveedor, success: true });
  } catch (error) {
    res.status(500).json({ messagge: error.message });
  }
};
