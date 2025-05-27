import {
  MantenimientoItem,
  EstadoInfo,
} from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface MobileMantenimientosListProps {
  mantenimientos: MantenimientoItem[];
  estados: EstadoInfo[];
}
