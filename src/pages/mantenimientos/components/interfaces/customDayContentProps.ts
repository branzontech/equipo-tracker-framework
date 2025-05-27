import { EstadoInfo } from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface CustomDayContentProps {
  date: Date;
  displayMonth?: Date;
  daysWithEvents: Record<
    string,
    { count: number; states: Record<string, boolean> }
  >;
  estados: EstadoInfo[];
  children?: React.ReactNode;
}
