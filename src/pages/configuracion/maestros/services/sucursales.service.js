import { sucursalesModel } from "../../../../db/models/sucursal.model.js";

class SucursalServiceClass {
  async findAll() {
    const sucursales = await sucursalesModel.findAll();
    return sucursales;
  }

  async create(sucursales) {
    const newSucursal = await sucursalesModel.create(sucursales);
    return newSucursal;
  }

  async delete(id) {
    const deletedSucursal = await sucursalesModel.delete(id);
    return deletedSucursal;
  }
}

export const SucursalService = new SucursalServiceClass();