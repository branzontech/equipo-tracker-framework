import IngresoToner from "@/pages/toners/views/Ingreso";
import ExistenciaToners from "@/pages/toners/views/Existencia";
import SalidaToners from "@/pages/toners/views/Salida";

export const tonersNavigation = [
  { path: "/toners/ingreso", element: <IngresoToner /> },
  { path: "/toners/existencia", element: <ExistenciaToners /> },
  { path: "/toners/salida", element: <SalidaToners /> },
];
