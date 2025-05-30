import { productosNavigation } from "./productos.navigation";
import { contratosNavigation } from "./contratos.navigation";
import { configuracionNavigation } from "./configuracion.navigation";
import { mantenimientosNavigation } from "./mantenimientos.navigation";
import { tonersNavigation } from "./toners.navigation";
import { coreNavigation } from "./core.navigation";

export const allRoutes = [
  ...coreNavigation,
  ...productosNavigation,
  ...contratosNavigation,
  ...configuracionNavigation,
  ...mantenimientosNavigation,
  ...tonersNavigation,
];
