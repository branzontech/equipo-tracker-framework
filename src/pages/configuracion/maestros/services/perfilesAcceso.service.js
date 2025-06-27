import { PerfilesAccesoModel } from "../../../../db/models/perfilesAcceso.model.js";

export const perfilesAccesoService = {
  create: async (data) => {
    const perfilesAcceso = await PerfilesAccesoModel.create(data);
    return perfilesAcceso;
  },
  findAll: async () => {
    const perfilesAcceso = await PerfilesAccesoModel.findAll();
    return perfilesAcceso;
  },
  getById: async (id) => {
    const perfilesAcceso = await PerfilesAccesoModel.getById(id);
    return perfilesAcceso;
  },
  update: async (id, perfilAcceso) => {
    const perfilesAcceso = await PerfilesAccesoModel.update(id, perfilAcceso);
    return perfilesAcceso;
  },
  detele: async (id) => {
    const perfilesAcceso = await PerfilesAccesoModel.delete_(id);
    return perfilesAcceso;
  },
};
