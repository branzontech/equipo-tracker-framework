import { tonerImpresoraModel } from "../../../db/models/toner_impresora.model.js";

export default class TonerImpresoraService {
  async getAll() {
    return tonerImpresoraModel.getAll();
  }
}

export const tonerImpresoraService = new TonerImpresoraService();