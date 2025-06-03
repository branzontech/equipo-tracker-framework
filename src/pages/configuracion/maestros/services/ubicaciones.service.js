import { UbiModel } from "../../../../db/models/ubi.model.js";

class UbiServiceClass {
  async findAll() {
    const ubicaciones = await UbiModel.findAll();
    return ubicaciones;
  }

  async create(ubicacion) {
    const newUbi = await UbiModel.create(ubicacion);
    return newUbi;
  }
}

export const UbiService = new UbiServiceClass();