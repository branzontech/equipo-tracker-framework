import { equipoService } from "../services/equipo.service.js";

export const create = async (req, res) => {
  try {
    const {
      nombre_equipo,
      nro_serie,
      modelo,
      marca_id,
      categoria_id,
      fecha_registro,
      tipo_activo,
      observaciones,
      especificaciones,
      seguridad,
      adquisicion,
      administrativa,
      estado_ubicacion,
      tags,
      imagen,
    } = req.body;

    const equipo = await equipoService.create({
      nombre_equipo,
      nro_serie,
      modelo,
      marca_id,
      categoria_id,
      fecha_registro,
      tipo_activo,
      observaciones,
      especificaciones,
      seguridad,
      adquisicion,
      administrativa,
      estado_ubicacion,
      tags,
      imagen,
    });

    res.status(201).json({ success: true, data: equipo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const {
      id_equipo,
      nombre_equipo,
      nro_serie,
      modelo,
      marca_id,
      categoria_id,
      fecha_registro,
      tipo_activo,
      observaciones,
      tags,
      especificaciones,
      seguridad,
      adquisicion,
      administrativa,
      estado_ubicacion,
    } = req.body;

    const equipo = await equipoService.update({
      id_equipo,
      nombre_equipo,
      nro_serie,
      modelo,
      marca_id,
      categoria_id,
      fecha_registro,
      tipo_activo,
      observaciones,
      tags,
      especificaciones,
      seguridad,
      adquisicion,
      administrativa,
      estado_ubicacion,
    });

    res.status(200).json({ success: true, data: equipo });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findAll = async (req, res) => {
  try {
    const equipos = await equipoService.findAll();
    res.status(200).json(equipos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const findAllById = async (req, res) => {
  try {
    const { nro_serie } = req.params;
    const equipo = await equipoService.findById(nro_serie);
    res.status(200).json(equipo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const delete_ = async (req, res) => {
  try {
    const { id } = req.params;
    const equipo = await equipoService.delete(id);
    res.status(200).json({ success: true, data: equipo });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "No se pudo deshabilitar el equipo. Intenta nuevamente.",
    });
  }
};

export const getTrazabilidadByEquipoId = async (req, res) => {
  try {
    const { id_equipo } = req.params;
    const trazabilidad = await equipoService.getTrazabilidadByEquipoId(id_equipo);
    res.status(200).json(trazabilidad);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};