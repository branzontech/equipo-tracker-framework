import { tonerImpresoraModel } from "../../../db/models/toner_impresora.model.js";

export default class TonerImpresoraService {
  async getAll() {
    return tonerImpresoraModel.getAll();
  };
  async getById(id) {
    return tonerImpresoraModel.getInfoByIdToner(id);
  };
}

export const tonerImpresoraService = new TonerImpresoraService();