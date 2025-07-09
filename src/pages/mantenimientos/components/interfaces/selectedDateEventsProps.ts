import {
  Mantenimiento,
  EstadoInfo,
} from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface SelectedDateEventsProps {
  selectedDate: Date | undefined;
  events: Mantenimiento[];
  estados: EstadoInfo[];
}
