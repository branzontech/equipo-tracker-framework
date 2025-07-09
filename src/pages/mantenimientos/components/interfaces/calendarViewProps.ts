import { EstadoInfo } from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface CalendarViewProps {
  isMobile: boolean;
  selectedDate: Date | undefined;
  selectedMonth: Date;
  selectedPeriodo: string;
  periodos: { value: string; label: string }[];
  estados: EstadoInfo[];
  daysWithEvents: Record<
    string,
    { count: number; states: Record<string, boolean> }
  >;
  modifiers: any;
  modifiersStyles: any;
  onDayClick: (day: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
  onPeriodoChange: (value: string) => void;
  navigateMonth: (direction: "prev" | "next") => void;
  showOutsideDays?: boolean;
}
