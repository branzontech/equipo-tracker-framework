import { EstadoInfo } from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface EventIndicatorProps {
  date: Date;
  daysWithEvents: Record<
    string,
    { count: number; states: Record<string, boolean> }
  >;
  estados: EstadoInfo[];
}
