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

  async delete(id) {
    const deletedSede = await SedesModel.delete(id);
    return deletedSede;
  }
}

export default new SedesService();
