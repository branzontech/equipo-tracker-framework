import { equipoService } from "../services/equipo.service.js";

export const create = async (req, res) => {
  const {
    nombre_equipo,
    nro_serie,
    modelo,
    marca_id,
    categoria_id,
    sucursal_id,
    estado_actual,
    fecha_registro,
    tipo_activo,
    garantia_fecha_fin,
    observaciones,
    especificaciones,
    seguridad,
    adquisicion,
    administrativa,
  } = req.body;

  const equipo = await equipoService.create({
    nombre_equipo,
    nro_serie,
    modelo,
    marca_id,
    categoria_id,
    sucursal_id,
    estado_actual,
    fecha_registro,
    tipo_activo,
    garantia_fecha_fin,
    observaciones,
    especificaciones,
    seguridad,
    adquisicion,
    administrativa,
  });

  res.status(201).json({ success: true, data: equipo });
};

export const findAll = async (req, res) => {
  const equipos = await equipoService.findAll();
  res.status(200).json(equipos);
};

export const findAllById = async (req, res) => {
  const { nro_serie } = req.params;
  const equipo = await equipoService.findById(nro_serie);
  res.status(200).json(equipo);
};

export const delete_ = async (req, res) => {
  const { id } = req.params;
  const equipo = await equipoService.delete_(id);
  res.status(200).json({ success: true, data: equipo });
};