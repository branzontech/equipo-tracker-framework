import { perifericoService } from "../services/periferico.service.js";

export const findAll = async (req, res) => {
  const perifericos = await perifericoService.findAll();
  res.status(200).json(perifericos);
};

export const findById = async (req, res) => {
  const { id } = req.params;
  const periferico = await perifericoService.findById(id);
  res.status(200).json(periferico);
};

export const findBySerial = async (req, res) => {
  const { serial } = req.params;
  const periferico = await perifericoService.findBySerial(serial);
  res.status(200).json(periferico);
};

export const update = async (req, res) => {
  const { id } = req.params;
  const {
    nombre,
    tipo,
    estado,
    equipo_asociado_id,
    serial,
    id_sede,
    marca_id,
  } = req.body;

  const periferico = await perifericoService.update(id, {
    nombre,
    tipo,
    estado,
    equipo_asociado_id,
    serial,
    id_sede,
    marca_id,
  });

  res.status(200).json({ success: true, data: periferico });
};

export const create = async (req, res) => {
  const {
    nombre,
    tipo,
    estado,
    equipo_asociado_id,
    serial,
    id_sede,
    marca_id,
  } = req.body;

  const periferico = await perifericoService.create({
    nombre,
    tipo,
    estado,
    equipo_asociado_id,
    serial,
    id_sede,
    marca_id,
  });

  res.status(200).json({ success: true, data: periferico });
};

export const delete_ = async (req, res) => {
  const { id } = req.params;
  const periferico = await perifericoService.delete(id);
  res.status(200).json({ success: true, data: periferico });
};
