import { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  Download,
  Clock,
  Check,
  Pause,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, isSameDay, parseISO } from "date-fns";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";
import { CalendarView } from "@/pages/mantenimientos/components/CalendarView";
import { FiltersPanel } from "@/pages/mantenimientos/components/FiltersPanel";
import { SelectedDateEvents } from "@/pages/mantenimientos/components/SelectedDateEvents";
import { Statistics } from "@/pages/mantenimientos/components/Statistics";
import { MobileMantenimientosList } from "@/pages/mantenimientos/components/MobileMantenimientosList";
import { MobileTabView } from "@/pages/mantenimientos/components/MobileTabView";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { EstadoInfo } from "./interfaces/mantenimiento";
import { formatFecha } from "@/hooks/use-global";
import { toZonedTime } from "date-fns-tz";

const estados: EstadoInfo[] = [
  {
    value: "Finalizado",
    label: "Finalizado",
    icon: Check,
    color: "bg-green-500",
  },
  {
    value: "Pendiente",
    label: "Pendiente",
    icon: Pause,
    color: "bg-yellow-500",
  },
  {
    value: "Iniciado",
    label: "Iniciado",
    icon: Clock,
    color: "bg-blue-500",
  },
  {
    value: "atrasado",
    label: "Atrasado",
    icon: AlertCircle,
    color: "bg-red-500",
  },
];

const periodos = [
  { value: "mensual", label: "Mensual" },
  { value: "bimestral", label: "Bimestral" },
  { value: "trimestral", label: "Trimestral" },
  { value: "cuatrimestral", label: "Cuatrimestral" },
  { value: "anual", label: "Anual" },
];

const AuditoriaMantenimiento = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("mensual");
  const [selectedResponsable, setSelectedResponsable] = useState<
    string | undefined
  >(undefined);
  const [tipoMantenimiento, setTipoMantenimiento] = useState<
    string | undefined
  >(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  const { mantenimientos } = useMantenimiento();

  // Manejar cambios de período
  useEffect(() => {
    // Reset date range when period changes
    setDateRange(undefined);
  }, [selectedPeriodo]);

  const toggleEstado = (estado: string) => {
    setSelectedEstados((prev) =>
      prev.includes(estado)
        ? prev.filter((e) => e !== estado)
        : [...prev, estado]
    );
  };

  // Filtrar mantenimientos
  const filteredMantenimientos = useMemo(() => {
    return mantenimientos.filter((item) => {
      const search = searchTerm.toLowerCase();

      const equipoNombre =
        item.mantenimiento_detalle?.[0]?.equipos?.nombre_equipo?.toLowerCase() ??
        "";
      const responsableNombre = item.usuarios?.nombre?.toLowerCase() ?? "";
      const ubicacion =
        item.mantenimiento_detalle?.[0]?.equipos?.sedes?.toLowerCase() ?? "";

      const tipo = item.tipo?.toLowerCase() ?? "";

      const matchesSearch =
        searchTerm === "" ||
        tipo.includes(search) ||
        equipoNombre.includes(search) ||
        responsableNombre.includes(search) ||
        ubicacion.includes(search);

      const matchesStatus =
        selectedEstados.length === 0 || selectedEstados.includes(item.estado);

      const matchesDateRange =
        !dateRange?.from ||
        (new Date(item.fecha_programada) >= new Date(dateRange.from) &&
          (!dateRange.to ||
            new Date(item.fecha_programada) <= new Date(dateRange.to)));

      const matchesResponsable =
        !selectedResponsable ||
        selectedResponsable === "todos" ||
        item.usuarios?.nombre === selectedResponsable;

      const matchesTipo =
        !tipoMantenimiento ||
        tipoMantenimiento === "todos" ||
        item.tipo === tipoMantenimiento;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesDateRange &&
        matchesResponsable &&
        matchesTipo
      );
    });
  }, [
    searchTerm,
    selectedEstados,
    dateRange,
    selectedResponsable,
    tipoMantenimiento,
    mantenimientos,
  ]);

  // Estadísticas por estado
  const statistics = useMemo(() => {
    return estados.map((estado) => {
      return {
        ...estado,
        count: filteredMantenimientos.filter((m) => m.estado === estado.value)
          .length,
      };
    });
  }, [filteredMantenimientos]);

  // Datos únicos para los filtros
  const uniqueResponsables = [
    ...new Set(mantenimientos.map((m) => m.usuarios?.nombre).filter(Boolean)),
  ];

  const uniqueTipos = [
    ...new Set(mantenimientos.map((m) => m.tipo).filter(Boolean)),
  ];

  const zonedDateOnly = (fechaIso?: string | Date): Date | undefined => {
    if (!fechaIso) return undefined;

    const zona = "America/Bogota";
    let fecha: Date;

    if (typeof fechaIso === "string") {
      fecha = parseISO(fechaIso);

      const isMedianocheUTC =
        fecha.getUTCHours() === 0 &&
        fecha.getUTCMinutes() === 0 &&
        fecha.getUTCSeconds() === 0;

      if (isMedianocheUTC) {
        fecha.setUTCHours(12, 0, 0, 0);
      }
    } else {
      fecha = fechaIso;
    }

    const zoned = toZonedTime(fecha, zona);
    return new Date(zoned.getFullYear(), zoned.getMonth(), zoned.getDate());
  };

  // Eventos para el día seleccionado
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];

    return filteredMantenimientos.filter((item) =>
      isSameDay(
        zonedDateOnly(item.fecha_programada),
        zonedDateOnly(selectedDate)
      )
    );
  }, [selectedDate, filteredMantenimientos]);

  const daysWithEvents = useMemo(() => {
    const eventsMap: Record<
      string,
      { count: number; states: Record<string, boolean> }
    > = {};

    filteredMantenimientos.forEach((item) => {
      const fechaZonificada = zonedDateOnly(item.fecha_programada);
      if (!fechaZonificada) return;

      const dateStr = format(fechaZonificada, "yyyy-MM-dd");

      if (!eventsMap[dateStr]) {
        eventsMap[dateStr] = { count: 0, states: {} };
      }

      eventsMap[dateStr].count += 1;
      eventsMap[dateStr].states[item.estado] = true;
    });

    return eventsMap;
  }, [filteredMantenimientos]);

  // Modificadores para el calendario
  const modifiers = useMemo(
    () => ({
      hasEvent: (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return !!daysWithEvents[dateStr];
      },
      hasAlertEvent: (date: Date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return !!daysWithEvents[dateStr]?.states?.atrasado;
      },
      selectedDay: (date: Date) =>
        selectedDate ? isSameDay(date, selectedDate) : false,
    }),
    [daysWithEvents, selectedDate]
  );

  // Estilos para los modificadores
  const modifiersStyles = {
    hasEvent: {
      fontWeight: "bold" as const,
      border: "2px solid var(--accent-9)",
    },
    hasAlertEvent: {
      color: "white",
      backgroundColor: "#ef4444",
    },
    selectedDay: {
      color: "white",
      backgroundColor: "#01242c",
    },
  };

  // Manejar clic en día
  const handleDayClick = (day: Date | undefined) => {
    setSelectedDate(day);
    if (isMobile) {
      setActiveTab("events");
    }
  };

  // Navegar entre meses
  const navigateMonth = (direction: "prev" | "next") => {
    setSelectedMonth((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      {/* Encabezado */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mantenimientos")}
          className="text-[#01242c] hover:bg-[#01242c]/10 hover:text-[#bff036]"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl md:text-2xl font-bold text-[#01242c]">
          Auditoría de Mantenimientos
        </h1>
      </div>

      {/* Versión móvil */}
      {isMobile ? (
        <>
          {/* Pestañas para versión móvil */}
          <MobileTabView
            activeTab={activeTab}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            selectedPeriodo={selectedPeriodo}
            periodos={periodos}
            searchTerm={searchTerm}
            dateRange={dateRange}
            selectedResponsable={selectedResponsable}
            tipoMantenimiento={tipoMantenimiento}
            selectedEstados={selectedEstados}
            daysWithEvents={daysWithEvents}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            estados={estados}
            statistics={statistics}
            selectedDateEvents={selectedDateEvents}
            uniqueResponsables={uniqueResponsables}
            uniqueTipos={uniqueTipos}
            onTabChange={setActiveTab}
            onDayClick={handleDayClick}
            onMonthChange={setSelectedMonth}
            onPeriodoChange={setSelectedPeriodo}
            navigateMonth={navigateMonth}
            onSearchChange={setSearchTerm}
            onDateRangeChange={setDateRange}
            onResponsableChange={setSelectedResponsable}
            onTipoChange={setTipoMantenimiento}
            toggleEstado={toggleEstado}
          />

          {/* Tabla de mantenimientos (siempre visible en móvil) */}
          <MobileMantenimientosList
            mantenimientos={filteredMantenimientos}
            estados={estados}
          />
        </>
      ) : (
        /* Versión escritorio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendario principal - ocupa 8 columnas */}
          <CalendarView
            isMobile={false}
            selectedDate={selectedDate}
            selectedMonth={selectedMonth}
            selectedPeriodo={selectedPeriodo}
            periodos={periodos}
            estados={estados}
            daysWithEvents={daysWithEvents}
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            onDayClick={handleDayClick}
            onMonthChange={setSelectedMonth}
            onPeriodoChange={setSelectedPeriodo}
            navigateMonth={navigateMonth}
            showOutsideDays={false}
          />

          {/* Panel lateral - ocupa 4 columnas */}
          <div className="lg:col-span-4 space-y-6">
            {/* Filtros */}
            <FiltersPanel
              searchTerm={searchTerm}
              dateRange={dateRange}
              selectedResponsable={selectedResponsable}
              tipoMantenimiento={tipoMantenimiento}
              selectedEstados={selectedEstados}
              estados={estados}
              uniqueResponsables={uniqueResponsables}
              uniqueTipos={uniqueTipos}
              onSearchChange={setSearchTerm}
              onDateRangeChange={setDateRange}
              onResponsableChange={setSelectedResponsable}
              onTipoChange={setTipoMantenimiento}
              toggleEstado={toggleEstado}
            />

            {/* Eventos del día seleccionado */}
            {selectedDate && (
              <SelectedDateEvents
                selectedDate={selectedDate}
                events={selectedDateEvents}
                estados={estados}
              />
            )}

            {/* Estadísticas */}
            <Statistics statistics={statistics} />

            {/* Botón de exportar */}
            <Card>
              <CardContent className="p-4">
                <Button className="w-full bg-[#01242c] text-white hover:bg-[#01242c]/90 hover:text-[#bff036]">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditoriaMantenimiento;
