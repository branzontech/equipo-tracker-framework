import { SedesModel } from "../../../../db/models/sedes.model.js";

class SedesService {
  async findAll() {
    const sedes = await SedesModel.findAll();
    return sedes;
  }
}

export default new SedesService();
