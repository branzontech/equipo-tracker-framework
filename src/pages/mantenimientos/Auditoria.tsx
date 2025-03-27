import { useState, useMemo } from "react";
import { ChevronLeft, Search, Download, Clock, Check, Pause, AlertCircle, CalendarIcon, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
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
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { format, subMonths, subDays, addMonths, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";
import { es } from "date-fns/locale";
import { DateRange } from "react-day-picker";

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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEstados, setSelectedEstados] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(),
    to: undefined,
  });
  const [isAdvancedFilterOpen, setIsAdvancedFilterOpen] = useState(false);
  const [selectedPeriodo, setSelectedPeriodo] = useState<string | undefined>(undefined);
  const [selectedResponsable, setSelectedResponsable] = useState<string | undefined>(undefined);
  const [tipoMantenimiento, setTipoMantenimiento] = useState<string | undefined>(undefined);
  const [showCalendar, setShowCalendar] = useState(true);

  const toggleEstado = (estado: string) => {
    setSelectedEstados(prev =>
      prev.includes(estado)
        ? prev.filter(e => e !== estado)
        : [...prev, estado]
    );
  };

  const setPredefinedPeriod = (period: string) => {
    setSelectedPeriodo(period);
    const today = new Date();
    
    let from, to;
    switch (period) {
      case "mensual":
        from = startOfMonth(today);
        to = endOfMonth(today);
        break;
      case "bimestral":
        from = startOfMonth(subMonths(today, 1));
        to = endOfMonth(today);
        break;
      case "trimestral":
        from = startOfMonth(subMonths(today, 2));
        to = endOfMonth(today);
        break;
      case "cuatrimestral":
        from = startOfMonth(subMonths(today, 3));
        to = endOfMonth(today);
        break;
      case "anual":
        from = startOfYear(today);
        to = endOfYear(today);
        break;
      default:
        from = today;
        to = undefined;
    }
    
    setDateRange({ from, to });
  };

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
        !dateRange.from || 
        (item.fecha >= dateRange.from && 
          (!dateRange.to || item.fecha <= dateRange.to));
      
      const matchesResponsable = 
        !selectedResponsable || 
        item.responsable === selectedResponsable;
      
      const matchesTipo = 
        !tipoMantenimiento || 
        item.tipo === tipoMantenimiento;
      
      return matchesSearch && matchesStatus && matchesDateRange && matchesResponsable && matchesTipo;
    });
  }, [searchTerm, selectedEstados, dateRange, selectedResponsable, tipoMantenimiento]);

  const statistics = useMemo(() => {
    return estados.map(estado => {
      return {
        ...estado,
        count: filteredMantenimientos.filter(m => m.estado === estado.value).length
      };
    });
  }, [filteredMantenimientos]);

  const uniqueResponsables = [...new Set(mantenimientos.map(m => m.responsable))];
  const uniqueTipos = [...new Set(mantenimientos.map(m => m.tipo))];

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => navigate("/mantenimientos")}
          className="text-[#01242c] hover:text-[#bff036] hover:bg-[#01242c]/10"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#01242c]">Auditoría de Mantenimientos</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-[#01242c]">Período de Auditoría</h3>
              <div className="flex gap-2">
                <Select value={selectedPeriodo} onValueChange={setPredefinedPeriod}>
                  <SelectTrigger className="w-36 border-[#01242c]/20">
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
                <Button 
                  variant="outline" 
                  size="icon"
                  className="text-[#01242c] border-[#01242c]/20 hover:bg-[#01242c]/10 hover:text-[#bff036]"
                  onClick={() => setShowCalendar(!showCalendar)}
                >
                  <CalendarIcon className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            {showCalendar && (
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                locale={es}
                className="w-full [&_.rdp-day]:w-10 [&_.rdp-day]:h-10 [&_.rdp-head_th]:w-10 [&_.rdp-nav]:h-8"
                numberOfMonths={2}
              />
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 space-y-6">
            <div>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-[#01242c]">Filtros</h3>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsAdvancedFilterOpen(!isAdvancedFilterOpen)}
                  className="text-[#01242c] border-[#01242c]/20 hover:bg-[#01242c]/10 hover:text-[#bff036]"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  {isAdvancedFilterOpen ? "Ocultar filtros" : "Filtros avanzados"}
                </Button>
              </div>
              
              <div className="space-y-2 mb-4">
                <h4 className="text-sm font-medium text-[#01242c]">Rango de Fechas</h4>
                <div className="grid gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={`w-full justify-start text-left font-normal border-[#01242c]/20 hover:bg-[#01242c]/10 hover:text-[#bff036] ${!dateRange?.from && "text-muted-foreground"}`}
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
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={dateRange}
                        onSelect={setDateRange}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="relative mb-4">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar mantenimientos..."
                  className="pl-8 border-[#01242c]/20 focus-visible:ring-[#01242c]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Collapsible open={isAdvancedFilterOpen} onOpenChange={setIsAdvancedFilterOpen}>
                <CollapsibleContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#01242c]">Responsable</h4>
                    <Select value={selectedResponsable} onValueChange={setSelectedResponsable}>
                      <SelectTrigger className="w-full border-[#01242c]/20">
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
                  
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-[#01242c]">Tipo de Mantenimiento</h4>
                    <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
                      <SelectTrigger className="w-full border-[#01242c]/20">
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
                </CollapsibleContent>
              </Collapsible>

              <div className="space-y-2 mt-4">
                <h4 className="text-sm font-medium mb-2 text-[#01242c]">Estado</h4>
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
                            : "hover:bg-[#01242c]/10 text-[#01242c]"
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
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 text-[#01242c]">Estadísticas</h3>
              <div className="space-y-3">
                {statistics.map((estado) => (
                  <div key={estado.value} className="flex justify-between items-center">
                    <span className="text-sm text-[#01242c]">{estado.label}</span>
                    <Badge variant="outline" className={estado.color + " text-white"}>
                      {estado.count}
                    </Badge>
                  </div>
                ))}
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
      </div>

      <Card className="mt-6">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-[#01242c]">
            Mantenimientos para el período seleccionado ({filteredMantenimientos.length})
          </h3>
          
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditoriaMantenimiento;
