export const tienePermiso = (
  permiso: string,
  permisosUsuario: string[] = []
): boolean => permisosUsuario.includes(permiso);
