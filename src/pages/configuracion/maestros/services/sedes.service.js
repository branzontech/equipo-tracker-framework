import { SedesModel } from "../../../../db/models/sedes.model.js";

class SedesService {
  async findAll() {
    const sedes = await SedesModel.findAll();
    return sedes;
  }

  async create(sede) {
    const sedeCreated = await SedesModel.create(sede);
    return sedeCreated;
  }
}

export default new SedesService();
