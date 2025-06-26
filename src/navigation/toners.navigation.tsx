import IngresoToner from "@/pages/toners/views/Ingreso";
import ExistenciaToners from "@/pages/toners/views/Existencia";
import SalidaToners from "@/pages/toners/views/Salida";
import ImpresoraForm from "@/pages/toners/views/ImpresoraForm";

export const tonersNavigation = [
  { path: "/toners/ingreso", element: <IngresoToner /> },
  { path: "/impresoras/ingreso", element: <ImpresoraForm /> },
  // { path: "/toners/edit-existencia", element: <ExistenciaToners /> },
  { path: "/toners/existencia", element: <ExistenciaToners /> },
  { path: "/toners/salida", element: <SalidaToners /> },
];
