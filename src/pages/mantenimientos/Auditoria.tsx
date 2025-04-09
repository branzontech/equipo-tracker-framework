
import { useState, useMemo, useEffect } from "react";
import { ChevronLeft, Search, Download, Clock, Check, Pause, AlertCircle, CalendarIcon, Filter, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format, subDays, addMonths, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";
import { useIsMobile } from "@/hooks/use-mobile";

const estados = [
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

const mantenimientos = [
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

  // Obtener la cantidad de eventos por día
  const getEventCount = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return daysWithEvents[dateStr]?.count || 0;
  };

  // Obtener estados de eventos por día
  const getEventStates = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return daysWithEvents[dateStr]?.states || {};
  };

  // Componente para renderizar un indicador de puntos para eventos
  const EventIndicator = ({ date }: { date: Date }) => {
    const count = getEventCount(date);
    if (count === 0) return null;
    
    const states = getEventStates(date);
    
    return (
      <div className="flex justify-center gap-1 mt-1">
        {Object.keys(states).map((state) => {
          const stateInfo = estados.find(s => s.value === state);
          return (
            <div 
              key={state}
              className={`w-1.5 h-1.5 rounded-full ${stateInfo?.color || 'bg-gray-400'}`}
            />
          );
        })}
      </div>
    );
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
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="calendar">Calendario</TabsTrigger>
              <TabsTrigger value="events">Eventos</TabsTrigger>
              <TabsTrigger value="filters">Filtros</TabsTrigger>
            </TabsList>

            {/* Contenido de pestañas */}
            <TabsContent value="calendar" className="mt-0">
              <Card>
                <CardHeader className="p-4 flex flex-row items-center justify-between">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigateMonth('prev')}
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                  <h3 className="font-medium">
                    {format(selectedMonth, "MMMM yyyy", { locale: es })}
                  </h3>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    onClick={() => navigateMonth('next')}
                  >
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardHeader>
                <CardContent className="p-2">
                  <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                    <SelectTrigger className="w-full mb-3">
                      <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                      {periodos.map((periodo) => (
                        <SelectItem key={periodo.value} value={periodo.value}>
                          {periodo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={handleDayClick}
                    month={selectedMonth}
                    onMonthChange={setSelectedMonth}
                    locale={es}
                    className="p-0"
                    classNames={{
                      day_today: "bg-gray-100",
                    }}
                    modifiers={modifiers}
                    modifiersStyles={modifiersStyles}
                    components={{
                      DayContent: ({ date, ...props }) => (
                        <div className="relative w-full h-full flex flex-col justify-center items-center">
                          <div {...props} />
                          <EventIndicator date={date} />
                        </div>
                      )
                    }}
                  />
                  
                  <div className="flex justify-center mt-4 gap-3">
                    {estados.map((estado) => (
                      <div key={estado.value} className="flex items-center gap-1">
                        <div className={`w-2 h-2 rounded-full ${estado.color}`} />
                        <span className="text-xs">{estado.label}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="mt-0">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    {selectedDate 
                      ? `Eventos del ${format(selectedDate, "d 'de' MMMM", { locale: es })}` 
                      : "Seleccione una fecha"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => {
                        const estadoInfo = estados.find(e => e.value === event.estado);
                        const Icon = estadoInfo?.icon || Clock;
                        
                        return (
                          <Card key={event.id} className="shadow-sm">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{event.tipo}</h4>
                                  <p className="text-sm text-muted-foreground">{event.equipo}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{event.ubicacion}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">{event.hora}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className={`${estadoInfo?.color} text-white text-xs whitespace-nowrap`}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {estadoInfo?.label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No hay eventos para esta fecha
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">Estadísticas</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-3">
                  {statistics.map((estado) => (
                    <div 
                      key={estado.value} 
                      className={`p-3 rounded-lg flex flex-col items-center ${estado.color} bg-opacity-20`}
                    >
                      <span className="text-sm font-medium text-[#01242c]">{estado.label}</span>
                      <span className="text-xl font-bold mt-1">{estado.count}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="filters" className="mt-0">
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">Búsqueda</h3>
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar mantenimientos..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Rango de Fechas</h3>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateRange?.from ? (
                            dateRange?.to ? (
                              <>
                                {format(dateRange.from, "P", { locale: es })} -{" "}
                                {format(dateRange.to, "P", { locale: es })}
                              </>
                            ) : (
                              format(dateRange.from, "P", { locale: es })
                            )
                          ) : (
                            <span>Seleccione un rango de fechas</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="center">
                        <Calendar
                          mode="range"
                          selected={dateRange}
                          onSelect={setDateRange}
                          initialFocus
                          locale={es}
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Responsable</h3>
                    <Select value={selectedResponsable} onValueChange={setSelectedResponsable}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar responsable" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {uniqueResponsables.map((responsable) => (
                          <SelectItem key={responsable} value={responsable}>
                            {responsable}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Tipo de Mantenimiento</h3>
                    <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="todos">Todos</SelectItem>
                        {uniqueTipos.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium mb-2">Estado</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {estados.map((estado) => {
                        const Icon = estado.icon;
                        const isSelected = selectedEstados.includes(estado.value);
                        return (
                          <button
                            key={estado.value}
                            className={`flex items-center gap-2 p-2 rounded-md transition-colors ${
                              isSelected 
                                ? estado.color + " text-white hover:opacity-90" 
                                : "border hover:bg-[#01242c]/10 text-[#01242c]"
                            }`}
                            onClick={() => toggleEstado(estado.value)}
                          >
                            <Icon className="h-4 w-4" />
                            <span className="text-sm">{estado.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full bg-[#01242c] text-white hover:bg-[#01242c]/90 hover:text-[#bff036]"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Exportar Reporte
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          
          {/* Tabla de mantenimientos (siempre visible en móvil) */}
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Mantenimientos ({filteredMantenimientos.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[300px]">
                <div className="p-3 space-y-3">
                  {filteredMantenimientos.length > 0 ? (
                    filteredMantenimientos.map((item) => {
                      const estadoInfo = estados.find(e => e.value === item.estado);
                      const Icon = estadoInfo?.icon || Clock;
                      
                      return (
                        <Card key={item.id} className="shadow-sm">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{item.tipo}</h4>
                                <p className="text-sm text-muted-foreground">{item.equipo}</p>
                                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                  <span>{format(item.fecha, "P", { locale: es })}</span>
                                  <span>•</span>
                                  <span>{item.hora}</span>
                                </div>
                              </div>
                              <Badge variant="outline" className={`${estadoInfo?.color} text-white text-xs whitespace-nowrap`}>
                                <Icon className="h-3 w-3 mr-1" />
                                {estadoInfo?.label}
                              </Badge>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No hay mantenimientos que coincidan con los filtros
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </>
      ) : (
        /* Versión escritorio */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Calendario principal - ocupa 8 columnas */}
          <Card className="lg:col-span-8">
            <CardHeader className="pb-0">
              <div className="flex justify-between items-center">
                <CardTitle>Calendario de Mantenimientos</CardTitle>
                <Select value={selectedPeriodo} onValueChange={setSelectedPeriodo}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Seleccionar período" />
                  </SelectTrigger>
                  <SelectContent>
                    {periodos.map((periodo) => (
                      <SelectItem key={periodo.value} value={periodo.value}>
                        {periodo.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-6">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('prev')}
                    className="text-[#01242c]"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Anterior
                  </Button>
                  <h3 className="text-lg font-medium text-[#01242c]">
                    {format(selectedMonth, "MMMM yyyy", { locale: es })}
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => navigateMonth('next')}
                    className="text-[#01242c]"
                  >
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
                
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={handleDayClick}
                  month={selectedMonth}
                  onMonthChange={setSelectedMonth}
                  locale={es}
                  className="pointer-events-auto"
                  classNames={{
                    day: "h-14 w-14 p-0 font-normal aria-selected:opacity-100", // Día más grande
                    caption: "text-base",
                    day_today: "bg-gray-100",
                  }}
                  modifiers={modifiers}
                  modifiersStyles={modifiersStyles}
                  components={{
                    DayContent: ({ date, ...props }) => (
                      <div className="w-full h-full flex flex-col justify-start items-center pt-2">
                        <div {...props} className="mb-1" />
                        <EventIndicator date={date} />
                        {getEventCount(date) > 0 && (
                          <span className="text-xs mt-1 font-medium">
                            {getEventCount(date)} {getEventCount(date) === 1 ? 'evento' : 'eventos'}
                          </span>
                        )}
                      </div>
                    )
                  }}
                />
                
                {/* Leyenda del calendario */}
                <div className="flex flex-wrap justify-center mt-6 gap-4">
                  {estados.map((estado) => (
                    <div key={estado.value} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${estado.color}`} />
                      <span className="text-sm">{estado.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Panel lateral - ocupa 4 columnas */}
          <div className="lg:col-span-4 space-y-6">
            {/* Filtros */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar mantenimientos..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Rango de Fechas</h3>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange?.to ? (
                            <>
                              {format(dateRange.from, "P", { locale: es })} -{" "}
                              {format(dateRange.to, "P", { locale: es })}
                            </>
                          ) : (
                            format(dateRange.from, "P", { locale: es })
                          )
                        ) : (
                          <span>Seleccione un rango de fechas</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="center">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        initialFocus
                        locale={es}
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Responsable</h3>
                  <Select value={selectedResponsable} onValueChange={setSelectedResponsable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {uniqueResponsables.map((responsable) => (
                        <SelectItem key={responsable} value={responsable}>
                          {responsable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Tipo de Mantenimiento</h3>
                  <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      {uniqueTipos.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-2">Estado</h3>
                  <div className="space-y-2">
                    {estados.map((estado) => {
                      const Icon = estado.icon;
                      const isSelected = selectedEstados.includes(estado.value);
                      return (
                        <button
                          key={estado.value}
                          className={`w-full flex items-center gap-2 p-2 rounded-md transition-colors ${
                            isSelected 
                              ? estado.color + " text-white hover:opacity-90" 
                              : "border hover:bg-[#01242c]/10 text-[#01242c]"
                          }`}
                          onClick={() => toggleEstado(estado.value)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{estado.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Eventos del día seleccionado */}
            {selectedDate && (
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">
                    Eventos del {format(selectedDate, "d 'de' MMMM", { locale: es })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="max-h-[400px] overflow-y-auto">
                  {selectedDateEvents.length > 0 ? (
                    <div className="space-y-3">
                      {selectedDateEvents.map((event) => {
                        const estadoInfo = estados.find(e => e.value === event.estado);
                        const Icon = estadoInfo?.icon || Clock;
                        
                        return (
                          <Card key={event.id} className="shadow-sm">
                            <CardContent className="p-3">
                              <div className="flex justify-between items-start">
                                <div>
                                  <h4 className="font-medium">{event.tipo}</h4>
                                  <p className="text-sm text-muted-foreground">{event.equipo}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{event.ubicacion}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Clock className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs">{event.hora}</span>
                                  </div>
                                </div>
                                <Badge variant="outline" className={`${estadoInfo?.color} text-white text-xs whitespace-nowrap`}>
                                  <Icon className="h-3 w-3 mr-1" />
                                  {estadoInfo?.label}
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-6 text-muted-foreground">
                      No hay eventos para esta fecha
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Estadísticas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3">
                {statistics.map((estado) => (
                  <div 
                    key={estado.value} 
                    className={`p-3 rounded-lg flex flex-col items-center ${estado.color} bg-opacity-20`}
                  >
                    <span className="text-sm font-medium text-[#01242c]">{estado.label}</span>
                    <span className="text-xl font-bold mt-1">{estado.count}</span>
                  </div>
                ))}
                
                <Button 
                  className="col-span-2 mt-2 bg-[#01242c] text-white hover:bg-[#01242c]/90 hover:text-[#bff036]"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Reporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Tabla de mantenimientos (solo versión escritorio) */}
      {!isMobile && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              Mantenimientos para el período seleccionado ({filteredMantenimientos.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <Checkbox />
                    </TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Equipo/Ubicación</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Fecha/Hora</TableHead>
                    <TableHead>Responsable</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMantenimientos.length > 0 ? (
                    filteredMantenimientos.map((mantenimiento) => {
                      const estadoInfo = estados.find(e => e.value === mantenimiento.estado);
                      const Icon = estadoInfo?.icon || Clock;
                      
                      return (
                        <TableRow 
                          key={mantenimiento.id}
                          className="hover:bg-[#01242c]/5 cursor-pointer"
                        >
                          <TableCell>
                            <Checkbox />
                          </TableCell>
                          <TableCell className="font-medium">{mantenimiento.tipo}</TableCell>
                          <TableCell>
                            <div>{mantenimiento.equipo}</div>
                            <div className="text-sm text-muted-foreground">{mantenimiento.ubicacion}</div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`${estadoInfo?.color} text-white`}>
                              <Icon className="h-3 w-3 mr-1" />
                              {estadoInfo?.label}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>{format(mantenimiento.fecha, "dd/MM/yyyy")}</div>
                            <div className="text-sm text-muted-foreground">{mantenimiento.hora}</div>
                          </TableCell>
                          <TableCell>{mantenimiento.responsable}</TableCell>
                        </TableRow>
                      );
                    })
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No se encontraron mantenimientos para los filtros seleccionados
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AuditoriaMantenimiento;
