import { impresoraModel } from "../../../db/models/impresora.model.js";

class impresoraService {
  async getAll() {
    return await impresoraModel.getAll();
  }

  async getById(id) {
    return await impresoraModel.getById(id);
  }

  async create(impresora) {
    return await impresoraModel.create(impresora);
  }

  async update(impresora) {
    return await impresoraModel.update(impresora);
  }

  async delete(id) {
    return await impresoraModel.delete(id);
  }
}

export default new impresoraService();