
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Search, Download, Clock, Check, Pause, AlertCircle, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format, subDays, addMonths, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

// Importing our new components
import { CalendarView } from "@/components/mantenimientos/CalendarView";
import { FiltersPanel } from "@/components/mantenimientos/FiltersPanel";
import { SelectedDateEvents } from "@/components/mantenimientos/SelectedDateEvents";
import { Statistics } from "@/components/mantenimientos/Statistics";
import { MobileMantenimientosList } from "@/components/mantenimientos/MobileMantenimientosList";
import { MobileTabView } from "@/components/mantenimientos/MobileTabView";
import { EstadoInfo, MantenimientoItem } from "@/types/mantenimiento";

const estados: EstadoInfo[] = [
  { value: "ejecutado", label: "Ejecutado", icon: Check, color: "bg-green-500" },
  { value: "pendiente", label: "Pendiente", icon: Pause, color: "bg-yellow-500" },
  { value: "programado", label: "Programado", icon: Clock, color: "bg-blue-500" },
  { value: "atrasado", label: "Atrasado", icon: AlertCircle, color: "bg-red-500" },
];

const periodos = [
  { value: "mensual", label: "Mensual" },
  { value: "bimestral", label: "Bimestral" },
  { value: "trimestral", label: "Trimestral" },
  { value: "cuatrimestral", label: "Cuatrimestral" },
  { value: "anual", label: "Anual" },
];

const mantenimientos: MantenimientoItem[] = [
  {
    id: 1,
    tipo: "Mantenimiento Preventivo",
    equipo: "Impresora HP LaserJet",
    ubicacion: "Sede Principal",
    estado: "programado",
    hora: "09:00 AM",
    responsable: "Juan Pérez",
    fecha: new Date(),
  },
  {
    id: 2,
    tipo: "Mantenimiento Correctivo",
    equipo: "Computador Dell XPS",
    ubicacion: "Departamento TI",
    estado: "ejecutado",
    hora: "11:30 AM",
    responsable: "María González",
    fecha: subDays(new Date(), 1),
  },
  {
    id: 3,
    tipo: "Actualización de Software",
    equipo: "Servidor Principal",
    ubicacion: "Data Center",
    estado: "pendiente",
    hora: "14:00 PM",
    responsable: "Carlos Rodríguez",
    fecha: subDays(new Date(), 2),
  },
  {
    id: 4,
    tipo: "Reemplazo de Componentes",
    equipo: "Router Cisco",
    ubicacion: "Sala de Comunicaciones",
    estado: "atrasado",
    hora: "16:30 PM",
    responsable: "Ana Martínez",
    fecha: subDays(new Date(), 5),
  },
  {
    id: 5,
    tipo: "Limpieza de Equipos",
    equipo: "Laboratorio de Pruebas",
    ubicacion: "Piso 3",
    estado: "programado",
    hora: "10:00 AM",
    responsable: "Luis Sánchez",
    fecha: addMonths(new Date(), 1),
  },
];

const AuditoriaMantenimiento = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string>("mensual");
  const [selectedResponsable, setSelectedResponsable] = useState<string | undefined>(undefined);
  const [tipoMantenimiento, setTipoMantenimiento] = useState<string | undefined>(undefined);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState("calendar");
  
  // Manejar cambios de período
  useEffect(() => {
    // Reset date range when period changes
    setDateRange(undefined);
  }, [selectedPeriodo]);

  const toggleEstado = (estado: string) => {
    setSelectedEstados(prev =>
      prev.includes(estado)
        ? prev.filter(e => e !== estado)
        : [...prev, estado]
    );
  };

  // Filtrar mantenimientos
  const filteredMantenimientos = useMemo(() => {
    return mantenimientos.filter(item => {
      const matchesSearch = 
        searchTerm === "" || 
        item.tipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.responsable.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ubicacion.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = 
        selectedEstados.length === 0 || 
        selectedEstados.includes(item.estado);
      
      const matchesDateRange = 
        !dateRange?.from || 
        (item.fecha >= dateRange.from && 
          (!dateRange.to || item.fecha <= dateRange.to));
      
      const matchesResponsable = 
        !selectedResponsable || 
        selectedResponsable === "todos" ||
        item.responsable === selectedResponsable;
      
      const matchesTipo = 
        !tipoMantenimiento || 
        tipoMantenimiento === "todos" ||
        item.tipo === tipoMantenimiento;
      
      return matchesSearch && matchesStatus && matchesDateRange && matchesResponsable && matchesTipo;
    });
  }, [searchTerm, selectedEstados, dateRange, selectedResponsable, tipoMantenimiento]);

  // Estadísticas por estado
  const statistics = useMemo(() => {
    return estados.map(estado => {
      return {
        ...estado,
        count: filteredMantenimientos.filter(m => m.estado === estado.value).length
      };
    });
  }, [filteredMantenimientos]);

  // Datos únicos para los filtros
  const uniqueResponsables = [...new Set(mantenimientos.map(m => m.responsable))];
  const uniqueTipos = [...new Set(mantenimientos.map(m => m.tipo))];

  // Eventos para el día seleccionado
  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];
    return filteredMantenimientos.filter(item => 
      isSameDay(item.fecha, selectedDate)
    );
  }, [selectedDate, filteredMantenimientos]);

  // Preparar modificadores para días con eventos
  const daysWithEvents = useMemo(() => {
    const eventsMap: Record<string, { count: number, states: Record<string, boolean> }> = {};
    
    filteredMantenimientos.forEach(item => {
      const dateStr = format(item.fecha, "yyyy-MM-dd");
      if (!eventsMap[dateStr]) {
        eventsMap[dateStr] = { count: 0, states: {} };
      }
      eventsMap[dateStr].count += 1;
      eventsMap[dateStr].states[item.estado] = true;
    });
    
    return eventsMap;
  }, [filteredMantenimientos]);
  
  // Modificadores para el calendario
  const modifiers = useMemo(() => ({
    hasEvent: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return !!daysWithEvents[dateStr];
    },
    hasAlertEvent: (date: Date) => {
      const dateStr = format(date, "yyyy-MM-dd");
      return !!daysWithEvents[dateStr]?.states?.atrasado;
    },
    selectedDay: (date: Date) => selectedDate ? isSameDay(date, selectedDate) : false,
  }), [daysWithEvents, selectedDate]);

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
      backgroundColor: "#01242c"
    }
  };

  // Manejar clic en día
  const handleDayClick = (day: Date | undefined) => {
    setSelectedDate(day);
    if (isMobile) {
      setActiveTab("events");
    }
  };

  // Navegar entre meses
  const navigateMonth = (direction: 'prev' | 'next') => {
    setSelectedMonth(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
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
        <h1 className="text-xl md:text-2xl font-bold text-[#01242c]">Auditoría de Mantenimientos</h1>
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
                <Button 
                  className="w-full bg-[#01242c] text-white hover:bg-[#01242c]/90 hover:text-[#bff036]"
                >
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
