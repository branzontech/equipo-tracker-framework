import MantenimientosIndex from "@/pages/mantenimientos/Index";
import ProgramacionMantenimiento from "@/pages/mantenimientos/Programacion";
import EjecucionMantenimiento from "@/pages/mantenimientos/Ejecucion";
import DocumentacionMantenimiento from "@/pages/mantenimientos/Documentacion";
import AuditoriaMantenimiento from "@/pages/mantenimientos/Auditoria";
import Details from "@/pages/mantenimientos/Details";
import EditEquipo from "@/pages/productos/views/EditEquipo";

export const mantenimientosNavigation = [
  { path: "/mantenimientos", element: <MantenimientosIndex /> },
  {
    path: "/mantenimientos/programacion",
    element: <ProgramacionMantenimiento />,
  },
  { path: "/mantenimientos/ejecucion", element: <EjecucionMantenimiento /> },
  {
    path: "/mantenimientos/documentacion",
    element: <DocumentacionMantenimiento />,
  },
  { path: "/mantenimientos/auditoria", element: <AuditoriaMantenimiento /> },
  { path: "/mantenimientos/detalles/:id", element: <Details /> },
];
