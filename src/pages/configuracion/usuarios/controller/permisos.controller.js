import { permisosService } from "../service/permisos.service.js";

export const getPermisos = async (req, res) => {
  try {
    const permisos = await permisosService.getAll();
    res.status(200).json(permisos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const asignarPermisosPerfil = async (req, res) => {
  try {
    const { perfilId, permisoIds } = req.body;
    const resultado = await permisosService.asignarPermisosPerfil(
      perfilId,
      permisoIds
    );
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPermisosPorPerfil = async (req, res) => {
  try {
    const { perfilId } = req.params;
    const resultado = await permisosService.getPermisosPorPerfil(perfilId);
    res.status(200).json(resultado);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
