import { perifericoService } from "../services/periferico.service.js";

export const findAll = async (req, res) => {
  const perifericos = await perifericoService.findAll();
  res.status(200).json(perifericos);
};

export const create = async (req, res) => {
  const { nombre, tipo, estado, equipo_asociado_id } = req.body;

  const periferico = await perifericoService.create({
    nombre,
    tipo,
    estado,
    equipo_asociado_id,
  });

  res.status(201).json({ success: true, data: periferico });
};

export const delete_ = async (req, res) => {
  const { id } = req.params;
  const periferico = await perifericoService.delete(id);
  res.status(200).json({ success: true, data: periferico });
};