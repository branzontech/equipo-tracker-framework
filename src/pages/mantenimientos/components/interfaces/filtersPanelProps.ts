import { DateRange } from "react-day-picker";
import { EstadoInfo } from "@/pages/mantenimientos/interfaces/mantenimiento";

export interface FiltersPanelProps {
  searchTerm: string;
  dateRange: DateRange | undefined;
  selectedResponsable: string | undefined;
  tipoMantenimiento: string | undefined;
  selectedEstados: string[];
  estados: EstadoInfo[];
  uniqueResponsables: string[];
  uniqueTipos: string[];
  onSearchChange: (value: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onResponsableChange: (value: string) => void;
  onTipoChange: (value: string) => void;
  toggleEstado: (estado: string) => void;
}
