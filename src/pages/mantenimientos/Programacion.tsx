
import { useState, useRef } from "react";
import { Calendar, ChevronLeft, Plus, Filter, Search, ListFilter, CheckSquare, Square, GripVertical } from "lucide-react";
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

const equiposMock = [
  { id: 1, nombre: "Laptop Dell XPS", tipo: "Laptop", sede: "Sede 1", area: "Sistemas", estado: "Activo" },
  { id: 2, nombre: "Impresora HP LaserJet", tipo: "Impresora", sede: "Sede 2", area: "Administración", estado: "Activo" },
  { id: 3, nombre: "Monitor LG 27'", tipo: "Monitor", sede: "Sede 1", area: "Ventas", estado: "Activo" },
  { id: 4, nombre: "Desktop Lenovo", tipo: "Desktop", sede: "Sede 3", area: "Recursos Humanos", estado: "Activo" },
  { id: 5, nombre: "Servidor Dell PowerEdge", tipo: "Servidor", sede: "Sede 1", area: "IT", estado: "Activo" },
];

// Datos mock para la tabla de mantenimientos programados
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
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

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

  // Funciones para el drag and drop de los equipos seleccionados
  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    // Add a custom class to indicate the dragged item
    e.currentTarget.classList.add("opacity-50");
  };

  const handleDragEnter = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    
    // Reorder the mantenimientos list
    const updatedMantenimientos = [...mantenimientos];
    const draggedItemContent = updatedMantenimientos[draggedItem];
    updatedMantenimientos.splice(draggedItem, 1);
    updatedMantenimientos.splice(index, 0, draggedItemContent);
    
    setMantenimientos(updatedMantenimientos);
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.classList.remove("opacity-50");
    setDraggedItem(null);
    toast.success("Orden actualizado correctamente");
  };

  // Funciones para el drag and drop de equipos en el modal de selección
  const handleEquipoDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.currentTarget.classList.add("opacity-50");
  };

  const handleEquipoDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleEquipoDrop = (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
    e.preventDefault();
    const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
    
    if (dragIndex === dropIndex) return;
    
    const newEquiposFiltrados = [...equiposFiltrados];
    const draggedEquipo = newEquiposFiltrados[dragIndex];
    
    // Remove the dragged item
    newEquiposFiltrados.splice(dragIndex, 1);
    // Insert it at the drop position
    newEquiposFiltrados.splice(dropIndex, 0, draggedEquipo);
    
    // Since we can't modify equiposMock directly (it's just for display), we just show a toast
    toast.success(`Reordenado: ${draggedEquipo.nombre}`);
  };

  const handleEquipoDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.classList.remove("opacity-50");
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
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
                              <TableHead className="w-[50px]">
                                <Checkbox
                                  checked={selectAll}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead className="w-[50px]"></TableHead>
                              <TableHead>Equipo</TableHead>
                              <TableHead className="hidden sm:table-cell">Tipo</TableHead>
                              <TableHead className="hidden sm:table-cell">Sede</TableHead>
                              <TableHead className="hidden sm:table-cell">Área</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {equiposFiltrados.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={6} className="text-center text-muted-foreground">
                                  No se encontraron equipos con los filtros seleccionados
                                </TableCell>
                              </TableRow>
                            ) : (
                              equiposFiltrados.map((equipo, index) => (
                                <TableRow 
                                  key={equipo.id}
                                  draggable
                                  index={index}
                                  onDragStart={(e) => handleEquipoDragStart(e, index)}
                                  onDragOver={handleEquipoDragOver}
                                  onDragEnter={(e) => handleEquipoDrop(e, index)}
                                  onDragEnd={handleEquipoDragEnd}
                                >
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedEquipos.includes(equipo.id)}
                                      onCheckedChange={() => handleSelectEquipo(equipo.id)}
                                    />
                                  </TableCell>
                                  <TableCell className="w-[40px]">
                                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                                  </TableCell>
                                  <TableCell className="font-medium">
                                    <div>{equipo.nombre}</div>
                                    <div className="text-xs text-gray-500 sm:hidden">
                                      {equipo.tipo} - {equipo.sede} - {equipo.area}
                                    </div>
                                  </TableCell>
                                  <TableCell className="hidden sm:table-cell">{equipo.tipo}</TableCell>
                                  <TableCell className="hidden sm:table-cell">{equipo.sede}</TableCell>
                                  <TableCell className="hidden sm:table-cell">{equipo.area}</TableCell>
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
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead className="text-[#01242c]">Equipo</TableHead>
                  <TableHead className="text-[#01242c] hidden sm:table-cell">Tipo</TableHead>
                  <TableHead className="text-[#01242c]">Fecha Programada</TableHead>
                  <TableHead className="text-[#01242c] hidden sm:table-cell">Responsable</TableHead>
                  <TableHead className="text-[#01242c] hidden sm:table-cell">Estado</TableHead>
                  <TableHead className="text-[#01242c]">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mantenimientos.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No hay mantenimientos programados
                    </TableCell>
                  </TableRow>
                ) : (
                  mantenimientos.map((mantenimiento, index) => (
                    <TableRow 
                      key={mantenimiento.id}
                      draggable
                      index={index} 
                      onDragStart={(e) => handleDragStart(e, index)}
                      onDragEnter={(e) => handleDragEnter(e, index)}
                      onDragOver={handleDragOver}
                      onDragEnd={handleDragEnd}
                    >
                      <TableCell className="w-[40px]">
                        <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                      </TableCell>
                      <TableCell className="font-medium">
                        <div>{mantenimiento.equipo}</div>
                        <div className="text-xs text-gray-500 sm:hidden">
                          {mantenimiento.tipo} - {mantenimiento.fechaProgramada}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{mantenimiento.tipo}</TableCell>
                      <TableCell>{mantenimiento.fechaProgramada}</TableCell>
                      <TableCell className="hidden sm:table-cell">{mantenimiento.responsable}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          mantenimiento.estado === 'Pendiente' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {mantenimiento.estado}
                        </span>
                      </TableCell>
                      <TableCell>
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
