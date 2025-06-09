import { sucursalesModel } from "../../../../db/models/sucursal.model.js";

class SucursalServiceClass {
  async findAll() {
    const sucursales = await sucursalesModel.findAll();
    return sucursales;
  }

  async findById(id) {
    const sucursal = await sucursalesModel.findById(id);
    return sucursal;
  }

  async create(sucursales) {
    const newSucursal = await sucursalesModel.create(sucursales);
    return newSucursal;
  }

  async delete(id) {
    return await sucursalesModel.delete(id);
  }

  async update(id, sucursales) {
    const updatedSucursal = await sucursalesModel.update(id, sucursales);
    return updatedSucursal;
  }
}

export const SucursalService = new SucursalServiceClass();
