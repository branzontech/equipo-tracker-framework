import MantenimientosIndex from "@/pages/mantenimientos/Index";
import ProgramacionMantenimiento from "@/pages/mantenimientos/Programacion";
import EjecucionMantenimiento from "@/pages/mantenimientos/Ejecucion";
import DocumentacionMantenimiento from "@/pages/mantenimientos/Documentacion";
import AuditoriaMantenimiento from "@/pages/mantenimientos/Auditoria";

export const mantenimientosNavigation = [
  { path: "/mantenimientos", element: <MantenimientosIndex /> },
  { path: "/mantenimientos/programacion", element: <ProgramacionMantenimiento /> },
  { path: "/mantenimientos/ejecucion", element: <EjecucionMantenimiento /> },
  { path: "/mantenimientos/documentacion", element: <DocumentacionMantenimiento /> },
  { path: "/mantenimientos/auditoria", element: <AuditoriaMantenimiento /> },
];
