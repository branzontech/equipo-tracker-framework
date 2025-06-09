import { SedesModel } from "../../../../db/models/sedes.model.js";

class SedesService {
  async findAll() {
    const sedes = await SedesModel.findAll();
    return sedes;
  }

  async findById(id) {
    const sede = await SedesModel.findById(id);
    return sede;
  }

  async create(sede) {
    const sedeCreated = await SedesModel.create(sede);
    return sedeCreated;
  }

  async delete(id) {
    return await SedesModel.delete(id);
  }
  async update(id, sede) {
    const updatedSede = await SedesModel.update(id, sede);
    return updatedSede;
  }
}

export default new SedesService();
