import {
  MantenimientoItem,
  EstadoInfo,
} from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface SelectedDateEventsProps {
  selectedDate: Date | undefined;
  events: MantenimientoItem[];
  estados: EstadoInfo[];
}
