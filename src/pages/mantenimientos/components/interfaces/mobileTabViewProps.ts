import {
  EstadoInfo,
  MantenimientoItem,
  StatItem,
} from "@/pages/mantenimientos/interfaces/mantenimiento";
import { DateRange } from "react-day-picker";

export interface MobileTabViewProps {
  activeTab: string;
  selectedDate: Date | undefined;
  selectedMonth: Date;
  selectedPeriodo: string;
  periodos: { value: string; label: string }[];
  searchTerm: string;
  dateRange: DateRange | undefined;
  selectedResponsable: string | undefined;
  tipoMantenimiento: string | undefined;
  selectedEstados: string[];
  daysWithEvents: Record<
    string,
    { count: number; states: Record<string, boolean> }
  >;
  modifiers: any;
  modifiersStyles: any;
  estados: EstadoInfo[];
  statistics: StatItem[];
  selectedDateEvents: MantenimientoItem[];
  uniqueResponsables: string[];
  uniqueTipos: string[];
  onTabChange: (value: string) => void;
  onDayClick: (day: Date | undefined) => void;
  onMonthChange: (date: Date) => void;
  onPeriodoChange: (value: string) => void;
  navigateMonth: (direction: "prev" | "next") => void;
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onResponsableChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  toggleEstado: (estado: string) => void;
}
