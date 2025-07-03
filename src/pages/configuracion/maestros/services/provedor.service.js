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
  async getById(id) {
    return await ProveedorModel.getById(id);
  },
  async update(id, proveedor) {
    return await ProveedorModel.update(id, proveedor);
  },
  async delete_(id) {
    return await ProveedorModel.delete_(id);
  },
};
