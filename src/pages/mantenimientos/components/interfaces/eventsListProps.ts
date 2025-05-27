import {
  MantenimientoItem,
  EstadoInfo,
} from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface EventsListProps {
  events: MantenimientoItem[];
  estados: EstadoInfo[];
  emptyMessage?: string;
}
