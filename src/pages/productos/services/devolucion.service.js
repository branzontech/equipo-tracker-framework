import { create } from "domain";
import { devolucionModel } from "../../../db/models/devolucion.model.js";

export const devolucionService = {
  findAll: async () => {
    const devoluciones = await devolucionModel.findAll();
    return devoluciones;
  },
  findEquiposEnMovimiento: async () => {
    const equipos = await devolucionModel.findEquiposEnMovimiento();
    return equipos;
  },
  create: async (devolucion) => {
    const devolucionCreated = await devolucionModel.create(devolucion);
    return devolucionCreated;
  },
};
