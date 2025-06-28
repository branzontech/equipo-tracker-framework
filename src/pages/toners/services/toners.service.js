import { tonersModel } from "../../../db/models/toners.model.js";

export default class TonersService {
  async getAll() {
    return tonersModel.getAll();
  }

  async getById(id) {
    return tonersModel.getById(id);
  }

  async create(toner) {
    return tonersModel.create(toner);
  }

  async update(toner) {
    return tonersModel.update(toner);
  }

  async delete(id) {
    return tonersModel.delete(id);
  }

  async getBySerial(serial) {
    return tonersModel.getBySerial(serial);
  }

  async createSalidaToner(salidaToner) {
    return tonersModel.createSalidaToner(salidaToner);
  }

  async findSalidasToner() {
    return tonersModel.findSalidasToner();
  }
}

export const tonersService = new TonersService();