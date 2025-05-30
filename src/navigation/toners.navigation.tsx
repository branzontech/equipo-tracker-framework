import IngresoToner from "@/pages/toners/Ingreso";
import ExistenciaToners from "@/pages/toners/Existencia";
import SalidaToners from "@/pages/toners/Salida";

export const tonersNavigation = [
  { path: "/toners/ingreso", element: <IngresoToner /> },
  { path: "/toners/existencia", element: <ExistenciaToners /> },
  { path: "/toners/salida", element: <SalidaToners /> },
];
