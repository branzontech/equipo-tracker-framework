import { ProveedorModel } from "../../../../db/models/proveedor.model.js";

export const ProveedorService = {
  async getAll() {
    return await ProveedorModel.getAll();
  },
  async create(data) {
    return await ProveedorModel.create(data);
  },
  async findByName(name) {
    return await ProveedorModel.findByName(name);
  },
};
