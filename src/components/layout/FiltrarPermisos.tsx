import { MenuItem } from "./interfaces/MenuItem";

export function filtrarMenuPorPermisos(
  menu: MenuItem[],
  permisos: string[]
): MenuItem[] {
  return menu
    .map((item) => {
      const tienePermiso = !item.id || permisos.includes(item.id);

      if (item.submenu) {
        const submenuFiltrado = filtrarMenuPorPermisos(item.submenu, permisos);
        if (submenuFiltrado.length > 0 || tienePermiso) {
          return { ...item, submenu: submenuFiltrado };
        }
        return null;
      }

      return tienePermiso ? item : null;
    })
    .filter(Boolean) as MenuItem[];
}
