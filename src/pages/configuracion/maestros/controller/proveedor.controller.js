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
