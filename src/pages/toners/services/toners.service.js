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

  async update(id, toner) {
    return tonersModel.update(id, toner);
  }

  async delete(id) {
    return tonersModel.delete(id);
  }
}

export const tonersService = new TonersService();