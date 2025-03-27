import { useState, useRef } from "react";
import { Calendar, ChevronLeft, Plus, Filter, Search, ListFilter, CheckSquare, Square, GripVertical, X, Search as SearchIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const equiposMock = [
  { id: 1, nombre: "Laptop Dell XPS", tipo: "Laptop", sede: "Sede 1", area: "Sistemas", estado: "Activo" },
  { id: 2, nombre: "Impresora HP LaserJet", tipo: "Impresora", sede: "Sede 2", area: "Administración", estado: "Activo" },
  { id: 3, nombre: "Monitor LG 27'", tipo: "Monitor", sede: "Sede 1", area: "Ventas", estado: "Activo" },
  { id: 4, nombre: "Desktop Lenovo", tipo: "Desktop", sede: "Sede 3", area: "Recursos Humanos", estado: "Activo" },
  { id: 5, nombre: "Servidor Dell PowerEdge", tipo: "Servidor", sede: "Sede 1", area: "IT", estado: "Activo" },
];

const mantenimientosMock = [
  { id: 1, equipo: "Laptop Dell XPS", tipo: "Preventivo", fechaProgramada: "2023-11-15", responsable: "Juan Pérez", estado: "Pendiente" },
  { id: 2, equipo: "Impresora HP LaserJet", tipo: "Correctivo", fechaProgramada: "2023-11-18", responsable: "María López", estado: "Programado" },
  { id: 3, equipo: "Monitor LG 27'", tipo: "Preventivo", fechaProgramada: "2023-11-20", responsable: "Carlos Gómez", estado: "Pendiente" },
  { id: 4, equipo: "Desktop Lenovo", tipo: "Preventivo", fechaProgramada: "2023-11-22", responsable: "Ana Martínez", estado: "Programado" },
  { id: 5, equipo: "Servidor Dell PowerEdge", tipo: "Correctivo", fechaProgramada: "2023-11-25", responsable: "Pedro Sánchez", estado: "Pendiente" },
];

interface FormValues {
  tipo: string;
  periodicidad: string;
  fechaInicio: Date;
  sede: string;
  bodega: string;
  responsable: string;
  descripcion: string;
  equipos: number[];
  tipoRegistro: "individual" | "masivo";
}

interface TableColumn {
  id: string;
  label: string;
  accessor: string;
  isVisible: boolean;
  order: number;
  className?: string;
}

const ProgramacionMantenimiento = () => {
  const navigate = useNavigate();
  const [tipoMantenimiento, setTipoMantenimiento] = useState<string>("todos");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filtroSede, setFiltroSede] = useState<string>("all");
  const [filtroArea, setFiltroArea] = useState<string>("all");
  const [filtroTipo, setFiltroTipo] = useState<string>("all");
  const [busqueda, setBusqueda] = useState<string>("");
  const [selectedEquipos, setSelectedEquipos] = useState<number[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [mantenimientos, setMantenimientos] = useState([...mantenimientosMock]);
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filtroResponsable, setFiltroResponsable] = useState<string>("all");
  const [filtroEstado, setFiltroEstado] = useState<string>("all");
  const [filtroFechaDesde, setFiltroFechaDesde] = useState<Date | undefined>(undefined);
  const [filtroFechaHasta, setFiltroFechaHasta] = useState<Date | undefined>(undefined);
  const [isSearching, setIsSearching] = useState(false);

  const [mainTableColumns, setMainTableColumns] = useState<TableColumn[]>([
    { id: "grip", label: "", accessor: "", isVisible: true, order: 0, className: "w-[40px]" },
    { id: "equipo", label: "Equipo", accessor: "equipo", isVisible: true, order: 1 },
    { id: "tipo", label: "Tipo", accessor: "tipo", isVisible: true, order: 2, className: "hidden sm:table-cell" },
    { id: "fechaProgramada", label: "Fecha Programada", accessor: "fechaProgramada", isVisible: true, order: 3 },
    { id: "responsable", label: "Responsable", accessor: "responsable", isVisible: true, order: 4, className: "hidden sm:table-cell" },
    { id: "estado", label: "Estado", accessor: "estado", isVisible: true, order: 5, className: "hidden sm:table-cell" },
    { id: "acciones", label: "Acciones", accessor: "", isVisible: true, order: 6 },
  ]);

  const [equipoTableColumns, setEquipoTableColumns] = useState<TableColumn[]>([
    { id: "checkbox", label: "", accessor: "", isVisible: true, order: 0, className: "w-[50px]" },
    { id: "grip", label: "", accessor: "", isVisible: true, order: 1, className: "w-[50px]" },
    { id: "nombre", label: "Equipo", accessor: "nombre", isVisible: true, order: 2 },
    { id: "tipo", label: "Tipo", accessor: "tipo", isVisible: true, order: 3, className: "hidden sm:table-cell" },
    { id: "sede", label: "Sede", accessor: "sede", isVisible: true, order: 4, className: "hidden sm:table-cell" },
    { id: "area", label: "Área", accessor: "area", isVisible: true, order: 5, className: "hidden sm:table-cell" },
  ]);

  const form = useForm<FormValues>({
    defaultValues: {
      tipo: "preventivo",
      periodicidad: "mensual",
      responsable: "",
      descripcion: "",
      tipoRegistro: "individual",
      sede: "",
      bodega: "",
      equipos: [],
    },
  });

  const equiposFiltrados = equiposMock.filter(equipo => {
    const cumpleFiltroSede = filtroSede === "all" || equipo.sede === filtroSede;
    const cumpleFiltroArea = filtroArea === "all" || equipo.area === filtroArea;
    const cumpleFiltroTipo = filtroTipo === "all" || equipo.tipo === filtroTipo;
    const cumpleBusqueda = !busqueda || 
      equipo.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      equipo.tipo.toLowerCase().includes(busqueda.toLowerCase());

    return cumpleFiltroSede && cumpleFiltroArea && cumpleFiltroTipo && cumpleBusqueda;
  });

  const mantenimientosFiltrados = mantenimientos.filter(mantenimiento => {
    const cumpleTipo = tipoMantenimiento === "todos" || 
      mantenimiento.tipo.toLowerCase() === tipoMantenimiento.toLowerCase();
    
    const cumpleSearch = !searchQuery || 
      mantenimiento.equipo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantenimiento.responsable.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantenimiento.estado.toLowerCase().includes(searchQuery.toLowerCase()) ||
      mantenimiento.tipo.toLowerCase().includes(searchQuery.toLowerCase());
    
    const cumpleResponsable = filtroResponsable === "all" || 
      mantenimiento.responsable === filtroResponsable;
    
    const cumpleEstado = filtroEstado === "all" || 
      mantenimiento.estado === filtroEstado;
    
    const fechaProgramada = new Date(mantenimiento.fechaProgramada);
    const cumpleFechaDesde = !filtroFechaDesde || 
      fechaProgramada >= filtroFechaDesde;
    
    const cumpleFechaHasta = !filtroFechaHasta || 
      fechaProgramada <= filtroFechaHasta;
    
    return cumpleTipo && cumpleSearch && cumpleResponsable && 
           cumpleEstado && cumpleFechaDesde && cumpleFechaHasta;
  });

  const resetFilters = () => {
    setTipoMantenimiento("todos");
    setSearchQuery("");
    setFiltroResponsable("all");
    setFiltroEstado("all");
    setFiltroFechaDesde(undefined);
    setFiltroFechaHasta(undefined);
    setIsSearching(false);
  };

  const handleSearch = () => {
    setIsSearching(true);
    toast.success("Filtros aplicados correctamente");
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEquipos([]);
      form.setValue('equipos', []);
    } else {
      const allEquiposIds = equiposFiltrados.map(equipo => equipo.id);
      setSelectedEquipos(allEquiposIds);
      form.setValue('equipos', allEquiposIds);
    }
    setSelectAll(!selectAll);
  };

  const handleSelectEquipo = (equipoId: number) => {
    const updatedSelection = selectedEquipos.includes(equipoId)
      ? selectedEquipos.filter(id => id !== equipoId)
      : [...selectedEquipos, equipoId];
    
    setSelectedEquipos(updatedSelection);
    form.setValue('equipos', updatedSelection);
    setSelectAll(updatedSelection.length === equiposFiltrados.length);
  };

  const onSubmit = (data: FormValues) => {
    console.log({ ...data, equipos: selectedEquipos });
    setIsDialogOpen(false);
    form.reset();
    setSelectedEquipos([]);
    setSelectAll(false);
    toast.success("Mantenimiento programado correctamente");
  };

  const handleColumnDragStart = (e: React.DragEvent<HTMLTableCellElement>, columnId: string) => {
    setDraggedColumn(columnId);
    e.currentTarget.classList.add('opacity-70');
    e.dataTransfer.effectAllowed = "move";
  };

  const handleColumnDragOver = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleColumnDragEnter = (e: React.DragEvent<HTMLTableCellElement>, columnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === columnId) return;
    e.currentTarget.classList.add('bg-slate-100');
  };

  const handleColumnDragLeave = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove('bg-slate-100');
  };

  const handleColumnDrop = (e: React.DragEvent<HTMLTableCellElement>, targetColumnId: string, isMainTable: boolean) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;
    
    e.currentTarget.classList.remove('bg-slate-100');
    
    const columns = isMainTable ? mainTableColumns : equipoTableColumns;
    const setColumns = isMainTable ? setMainTableColumns : setEquipoTableColumns;
    
    const draggedCol = columns.find(col => col.id === draggedColumn);
    const targetCol = columns.find(col => col.id === targetColumnId);
    
    if (!draggedCol || !targetCol) return;
    
    const newColumns = columns.map(col => {
      if (col.id === draggedColumn) {
        return { ...col, order: targetCol.order };
      }
      if (col.id === targetColumnId) {
        return { ...col, order: draggedCol.order };
      }
      return col;
    });
    
    setColumns(newColumns);
    toast.success(`Columnas reordenadas: ${draggedCol.label} y ${targetCol.label}`);
  };

  const handleColumnDragEnd = (e: React.DragEvent<HTMLTableCellElement>) => {
    e.currentTarget.classList.remove('opacity-70');
    setDraggedColumn(null);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mantenimientos")}
          className="mb-2 sm:mb-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#01242c]">
          Programación de Mantenimientos
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input 
                placeholder="Buscar mantenimientos..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de mantenimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="preventivo">Preventivo</SelectItem>
                <SelectItem value="correctivo">Correctivo</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant="outline" 
              size="default"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
            
            <Button 
              variant="default" 
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
            >
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </div>
          
          <Collapsible open={showAdvancedFilters} onOpenChange={setShowAdvancedFilters}>
            <CollapsibleContent className="pt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <FormLabel>Responsable</FormLabel>
                  <Select value={filtroResponsable} onValueChange={setFiltroResponsable}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Juan Pérez">Juan Pérez</SelectItem>
                      <SelectItem value="María López">María López</SelectItem>
                      <SelectItem value="Carlos Gómez">Carlos Gómez</SelectItem>
                      <SelectItem value="Ana Martínez">Ana Martínez</SelectItem>
                      <SelectItem value="Pedro Sánchez">Pedro Sánchez</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <FormLabel>Estado</FormLabel>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>
                      <SelectItem value="Pendiente">Pendiente</SelectItem>
                      <SelectItem value="Programado">Programado</SelectItem>
                      <SelectItem value="En Progreso">En Progreso</SelectItem>
                      <SelectItem value="Completado">Completado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <FormLabel>Fecha desde</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtroFechaDesde ? format(filtroFechaDesde, "PP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtroFechaDesde}
                        onSelect={setFiltroFechaDesde}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div>
                  <FormLabel>Fecha hasta</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtroFechaHasta ? format(filtroFechaHasta, "PP", { locale: es }) : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtroFechaHasta}
                        onSelect={setFiltroFechaHasta}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={resetFilters}
                  className="flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>
          
          {isSearching && (
            <div className="flex items-center pt-2">
              <div className="text-sm text-gray-500">
                {mantenimientosFiltrados.length} resultados encontrados
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={resetFilters}
                className="ml-auto text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mantenimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl text-[#01242c]">Programar Nuevo Mantenimiento</DialogTitle>
              <DialogDescription className="text-sm sm:text-base">
                Complete los detalles para programar un nuevo mantenimiento.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="w-full grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-0">
                    <TabsTrigger value="general" className="text-sm sm:text-base">Información General</TabsTrigger>
                    <TabsTrigger value="equipos" className="text-sm sm:text-base">Equipos</TabsTrigger>
                    <TabsTrigger value="detalles" className="text-sm sm:text-base">Detalles Adicionales</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sede"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Sede</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione la sede" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="sede1">Sede 1</SelectItem>
                                <SelectItem value="sede2">Sede 2</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bodega"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Bodega</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione la bodega" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="bodega1">Bodega 1</SelectItem>
                                <SelectItem value="bodega2">Bodega 2</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tipoRegistro"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Tipo de Registro</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione el tipo de registro" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="individual">Individual</SelectItem>
                                <SelectItem value="masivo">Masivo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Tipo de Mantenimiento</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione el tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="preventivo">Preventivo</SelectItem>
                                <SelectItem value="correctivo">Correctivo</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="periodicidad"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm sm:text-base">Periodicidad</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccione la periodicidad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="mensual">Mensual</SelectItem>
                                <SelectItem value="trimestral">Trimestral</SelectItem>
                                <SelectItem value="anual">Anual</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="equipos" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <FormLabel className="text-sm sm:text-base">Búsqueda</FormLabel>
                          <div className="relative">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                              placeholder="Buscar equipos..."
                              className="pl-8"
                              value={busqueda}
                              onChange={(e) => setBusqueda(e.target.value)}
                            />
                          </div>
                        </div>
                        <div className="w-full sm:w-[200px]">
                          <FormLabel className="text-sm sm:text-base">Sede</FormLabel>
                          <Select value={filtroSede} onValueChange={setFiltroSede}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filtrar por sede" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="Sede 1">Sede 1</SelectItem>
                              <SelectItem value="Sede 2">Sede 2</SelectItem>
                              <SelectItem value="Sede 3">Sede 3</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full sm:w-[200px]">
                          <FormLabel className="text-sm sm:text-base">Área</FormLabel>
                          <Select value={filtroArea} onValueChange={setFiltroArea}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filtrar por área" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todas</SelectItem>
                              <SelectItem value="Sistemas">Sistemas</SelectItem>
                              <SelectItem value="Administración">Administración</SelectItem>
                              <SelectItem value="Ventas">Ventas</SelectItem>
                              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
                              <SelectItem value="IT">IT</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="w-full sm:w-[200px]">
                          <FormLabel className="text-sm sm:text-base">Tipo</FormLabel>
                          <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                            <SelectTrigger>
                              <SelectValue placeholder="Filtrar por tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="Laptop">Laptop</SelectItem>
                              <SelectItem value="Desktop">Desktop</SelectItem>
                              <SelectItem value="Impresora">Impresora</SelectItem>
                              <SelectItem value="Monitor">Monitor</SelectItem>
                              <SelectItem value="Servidor">Servidor</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="border rounded-md overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {equipoTableColumns
                                .sort((a, b) => a.order - b.order)
                                .filter(col => col.isVisible)
                                .map((column) => (
                                  <TableHead 
                                    key={column.id}
                                    className={column.className}
                                    draggable={column.id !== "checkbox" && column.id !== "grip"}
                                    columnId={column.id}
                                    onDragStart={(e) => handleColumnDragStart(e, column.id)}
                                    onDragOver={handleColumnDragOver}
                                    onDragEnter={(e) => handleColumnDragEnter(e, column.id)}
                                    onDragLeave={handleColumnDragLeave}
                                    onDrop={(e) => handleColumnDrop(e, column.id, false)}
                                    onDragEnd={handleColumnDragEnd}
                                  >
                                    {column.id === "checkbox" ? (
                                      <Checkbox
                                        checked={selectAll}
                                        onCheckedChange={handleSelectAll}
                                      />
                                    ) : column.id === "grip" ? (
                                      <div></div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        {column.id !== "checkbox" && column.id !== "grip" && (
                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        {column.label}
                                      </div>
                                    )}
                                  </TableHead>
                                ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {equiposFiltrados.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={equipoTableColumns.filter(col => col.isVisible).length} className="text-center text-muted-foreground">
                                  No se encontraron equipos con los filtros seleccionados
                                </TableCell>
                              </TableRow>
                            ) : (
                              equiposFiltrados.map((equipo) => (
                                <TableRow key={equipo.id}>
                                  {equipoTableColumns
                                    .sort((a, b) => a.order - b.order)
                                    .filter(col => col.isVisible)
                                    .map((column) => {
                                      if (column.id === "checkbox") {
                                        return (
                                          <TableCell key={`${equipo.id}-${column.id}`}>
                                            <Checkbox
                                              checked={selectedEquipos.includes(equipo.id)}
                                              onCheckedChange={() => handleSelectEquipo(equipo.id)}
                                            />
                                          </TableCell>
                                        );
                                      } else if (column.id === "grip") {
                                        return (
                                          <TableCell key={`${equipo.id}-${column.id}`}>
                                            <GripVertical className="h-4 w-4 text-gray-400" />
                                          </TableCell>
                                        );
                                      } else if (column.id === "nombre") {
                                        return (
                                          <TableCell key={`${equipo.id}-${column.id}`} className="font-medium">
                                            <div>{equipo.nombre}</div>
                                            <div className="text-xs text-gray-500 sm:hidden">
                                              {equipo.tipo} - {equipo.sede} - {equipo.area}
                                            </div>
                                          </TableCell>
                                        );
                                      } else {
                                        return (
                                          <TableCell key={`${equipo.id}-${column.id}`} className={column.className}>
                                            {equipo[column.accessor as keyof typeof equipo]}
                                          </TableCell>
                                        );
                                      }
                                    })}
                                </TableRow>
                              ))
                            )}
                          </TableBody>
                        </Table>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {selectedEquipos.length} equipos seleccionados
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detalles" className="space-y-4 mt-4">
                    <FormField
                      control={form.control}
                      name="fechaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Fecha de Inicio</FormLabel>
                          <FormControl>
                            <div className="overflow-x-auto">
                              <CalendarComponent
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                locale={es}
                                className="rounded-md border w-full sm:w-auto"
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="responsable"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Responsable</FormLabel>
                          <FormControl>
                            <Input placeholder="Nombre del responsable" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-sm sm:text-base">Descripción</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Detalles del mantenimiento"
                              className="min-h-[100px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </TabsContent>
                </Tabs>

                <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="w-full sm:w-auto order-2 sm:order-1"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f] order-1 sm:order-2"
                  >
                    Programar Mantenimiento
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {mainTableColumns
                    .sort((a, b) => a.order - b.order)
                    .filter(col => col.isVisible)
                    .map((column) => (
                      <TableHead 
                        key={column.id}
                        className={column.className}
                        draggable={column.id !== "acciones" && column.id !== "grip"}
                        columnId={column.id}
                        onDragStart={(e) => handleColumnDragStart(e, column.id)}
                        onDragOver={handleColumnDragOver}
                        onDragEnter={(e) => handleColumnDragEnter(e, column.id)}
                        onDragLeave={handleColumnDragLeave}
                        onDrop={(e) => handleColumnDrop(e, column.id, true)}
                        onDragEnd={handleColumnDragEnd}
                      >
                        {column.id === "grip" ? (
                          <div></div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#01242c]">
                            {column.id !== "acciones" && column.id !== "grip" && (
                              <GripVertical className="h-4 w-4 text-muted-foreground" />
                            )}
                            {column.label}
                          </div>
                        )}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mantenimientosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={mainTableColumns.filter(col => col.isVisible).length} className="text-center py-8 text-muted-foreground">
                      No hay mantenimientos programados que coincidan con los criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  mantenimientosFiltrados.map((mantenimiento) => (
                    <TableRow key={mantenimiento.id}>
                      {mainTableColumns
                        .sort((a, b) => a.order - b.order)
                        .filter(col => col.isVisible)
                        .map((column) => {
                          if (column.id === "grip") {
                            return (
                              <TableCell key={`${mantenimiento.id}-${column.id}`} className={column.className}>
                                <GripVertical className="h-4 w-4 text-gray-400" />
                              </TableCell>
                            );
                          } else if (column.id === "equipo") {
                            return (
                              <TableCell key={`${mantenimiento.id}-${column.id}`} className="font-medium">
                                <div>{mantenimiento.equipo}</div>
                                <div className="text-xs text-gray-500 sm:hidden">
                                  {mantenimiento.tipo} - {mantenimiento.fechaProgramada}
                                </div>
                              </TableCell>
                            );
                          } else if (column.id === "estado") {
                            return (
                              <TableCell key={`${mantenimiento.id}-${column.id}`} className={column.className}>
                                <span className={`px-2 py-1 rounded-full text-xs ${
                                  mantenimiento.estado === 'Pendiente' 
                                    ? 'bg-yellow-100 text-yellow-800' 
                                    : 'bg-blue-100 text-blue-800'
                                }`}>
                                  {mantenimiento.estado}
                                </span>
                              </TableCell>
                            );
                          } else if (column.id === "acciones") {
                            return (
                              <TableCell key={`${mantenimiento.id}-${column.id}`}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    toast.info(`Ver detalles de ${mantenimiento.equipo}`);
                                  }}
                                >
                                  Ver
                                </Button>
                              </TableCell>
                            );
                          } else if (column.accessor) {
                            return (
                              <TableCell key={`${mantenimiento.id}-${column.id}`} className={column.className}>
                                {mantenimiento[column.accessor as keyof typeof mantenimiento]}
                              </TableCell>
                            );
                          } else {
                            return <TableCell key={`${mantenimiento.id}-${column.id}`}></TableCell>;
                          }
                        })}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramacionMantenimiento;
