import { trasladoModel } from "../../../db/models/traslado.model.js";

export const trasladoServices = {
  async findAll() {
    return trasladoModel.findAll();
  },
  async create(traslado) {
    return trasladoModel.create(traslado);
  },
};
