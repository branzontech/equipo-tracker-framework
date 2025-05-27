
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, FileText, Settings, Plus, Search, User, MapPin, UserRound, ClipboardPen, Calendar as CalendarIcon, Clock, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormDescription } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
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
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Equipo } from "@/pages/mantenimientos/interfaces/equipo";


interface Sede {
  id: string;
  nombre: string;
}

interface Responsable {
  id: string;
  nombre: string;
  cargo: string;
  email: string;
  telefono: string;
}

interface Tecnico {
  id: string;
  nombre: string;
  especialidad: string;
}

const equiposMock: Equipo[] = [
  { id: "1", nombre: "Laptop Dell XPS", serial: "XPS123", responsable: "Juan Pérez", area: "Sistemas", sede: "Sede Principal", marca: "Dell", modelo: "XPS 15", activoFijo: "AF-001" },
  { id: "2", nombre: "Impresora HP", serial: "HP456", responsable: "María García", area: "Administración", sede: "Sede Norte", marca: "HP", modelo: "LaserJet Pro", activoFijo: "AF-002" },
  { id: "3", nombre: "Monitor LG", serial: "LGM789", responsable: "Carlos Rodríguez", area: "Contabilidad", sede: "Sede Principal", marca: "LG", modelo: "UltraWide", activoFijo: "AF-003" },
  { id: "4", nombre: "Desktop Lenovo", serial: "LEN321", responsable: "Ana Martínez", area: "Recursos Humanos", sede: "Sede Sur", marca: "Lenovo", modelo: "ThinkCentre", activoFijo: "AF-004" },
  { id: "5", nombre: "Servidor HP", serial: "SRV567", responsable: "Roberto Díaz", area: "TI", sede: "Centro de Datos", marca: "HP", modelo: "ProLiant", activoFijo: "AF-005" },
];

const sedesMock: Sede[] = [
  { id: "1", nombre: "Sede Principal" },
  { id: "2", nombre: "Sede Norte" },
  { id: "3", nombre: "Sede Sur" },
  { id: "4", nombre: "Centro de Datos" },
];

const responsablesMock: Responsable[] = [
  { id: "1", nombre: "Juan Pérez", cargo: "Desarrollador", email: "juan.perez@empresa.com", telefono: "555-1234" },
  { id: "2", nombre: "María García", cargo: "Administrativa", email: "maria.garcia@empresa.com", telefono: "555-5678" },
  { id: "3", nombre: "Carlos Rodríguez", cargo: "Contador", email: "carlos.rodriguez@empresa.com", telefono: "555-9012" },
  { id: "4", nombre: "Ana Martínez", cargo: "Recursos Humanos", email: "ana.martinez@empresa.com", telefono: "555-3456" },
  { id: "5", nombre: "Roberto Díaz", cargo: "Administrador de Sistemas", email: "roberto.diaz@empresa.com", telefono: "555-7890" },
];

const tecnicosMock: Tecnico[] = [
  { id: "1", nombre: "Fernando López", especialidad: "Hardware" },
  { id: "2", nombre: "Patricia Gómez", especialidad: "Software" },
  { id: "3", nombre: "Santiago Herrera", especialidad: "Redes" },
  { id: "4", nombre: "Luisa Ramírez", especialidad: "Servidores" },
];

const listadoChequeo = [
  "Limpieza de hardware",
  "Actualización de software",
  "Verificación de componentes",
  "Pruebas de rendimiento",
  "Respaldo de información",
  "Limpieza de ventiladores",
  "Verificación de temperatura",
  "Revisión de batería",
  "Actualización de drivers",
  "Desfragmentación de disco",
];

const MantenimientosIndex = () => {
  const navigate = useNavigate();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [busqueda, setBusqueda] = useState("");
  const [equiposFiltrados, setEquiposFiltrados] = useState<Equipo[]>([]);
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<Equipo | null>(null);
  const [fechaProgramada, setFechaProgramada] = useState<Date>();
  const [tiempoEstimado, setTiempoEstimado] = useState<string>("1");
  const [currentTab, setCurrentTab] = useState("equipo");

  const form = useForm({
    defaultValues: {
      equipo: "",
      sede: "",
      responsable: "",
      tecnico: "",
      tipo: "preventivo",
      prioridad: "media",
      itemsChequeo: [] as string[],
      descripcion: "",
      observaciones: "",
      recomendaciones: "",
      fechaProgramada: new Date(),
    },
  });

  const handleSearch = (value: string) => {
    setBusqueda(value);
    if (value.length > 2) {
      const filtrados = equiposMock.filter(
        (equipo) =>
          equipo.nombre.toLowerCase().includes(value.toLowerCase()) ||
          equipo.serial.toLowerCase().includes(value.toLowerCase()) ||
          equipo.responsable.toLowerCase().includes(value.toLowerCase()) ||
          equipo.area.toLowerCase().includes(value.toLowerCase())
      );
      setEquiposFiltrados(filtrados);
    } else {
      setEquiposFiltrados([]);
    }
  };

  const selectEquipo = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setBusqueda(equipo.nombre);
    setEquiposFiltrados([]);
    
    // Auto-fill sede and responsable based on selected equipo
    const responsable = responsablesMock.find(r => r.nombre === equipo.responsable);
    
    if (responsable) {
      form.setValue("responsable", responsable.id);
    }
    
    form.setValue("sede", sedesMock.find(s => s.nombre === equipo.sede)?.id || "");
  };

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  const nextTab = () => {
    if (currentTab === "equipo") {
      if (!equipoSeleccionado) {
        toast.error("Debe seleccionar un equipo");
        return;
      }
      setCurrentTab("detalles");
    } else if (currentTab === "detalles") {
      setCurrentTab("programacion");
    }
  };

  const previousTab = () => {
    if (currentTab === "detalles") {
      setCurrentTab("equipo");
    } else if (currentTab === "programacion") {
      setCurrentTab("detalles");
    }
  };

  const onSubmit = (data: any) => {
    if (!equipoSeleccionado) {
      toast.error("Debe seleccionar un equipo");
      return;
    }
    console.log({ 
      ...data, 
      equipo: equipoSeleccionado,
      fechaProgramada: fechaProgramada,
      tiempoEstimado: tiempoEstimado,
    });
    toast.success("Mantenimiento creado exitosamente");
    setIsDialogOpen(false);
    form.reset();
    setEquipoSeleccionado(null);
    setBusqueda("");
    setCurrentTab("equipo");
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-xl sm:text-2xl font-bold text-[#01242c] mb-4 sm:mb-6">
        Gestión de Mantenimientos
      </h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036] text-[#01242c]">
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
                  <Plus className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
                  <span>Nuevo Mantenimiento</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 sm:p-6 pt-0">
                <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
                  Crear un nuevo registro de mantenimiento para un equipo.
                </p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-3xl h-[90vh] max-h-[90vh] overflow-y-auto p-4 sm:p-6 bg-white">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Nuevo Mantenimiento</DialogTitle>
              <DialogDescription>
                Complete la información para programar un nuevo mantenimiento
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 mt-4">
                <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="equipo">Equipo</TabsTrigger>
                    <TabsTrigger value="detalles">Detalles</TabsTrigger>
                    <TabsTrigger value="programacion">Programación</TabsTrigger>
                  </TabsList>

                  <TabsContent value="equipo" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="relative">
                        <div className="flex items-center mb-2">
                          <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                          <Label className="text-sm sm:text-base font-medium">Buscar Equipo</Label>
                        </div>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            placeholder="Buscar por nombre, serial, responsable o área"
                            value={busqueda}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 mt-1"
                          />
                        </div>
                        {equiposFiltrados.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {equiposFiltrados.map((equipo) => (
                              <div
                                key={equipo.id}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                onClick={() => selectEquipo(equipo)}
                              >
                                <div className="font-medium text-sm sm:text-base">{equipo.nombre}</div>
                                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span><span className="font-semibold">Serial:</span> {equipo.serial}</span>
                                    <span><span className="font-semibold">Activo fijo:</span> {equipo.activoFijo}</span>
                                    <span><span className="font-semibold">Marca:</span> {equipo.marca}</span>
                                    <span><span className="font-semibold">Modelo:</span> {equipo.modelo}</span>
                                    <span><span className="font-semibold">Responsable:</span> {equipo.responsable}</span>
                                    <span><span className="font-semibold">Área:</span> {equipo.area}</span>
                                    <span><span className="font-semibold">Sede:</span> {equipo.sede}</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {equipoSeleccionado && (
                        <div className="bg-gray-50 rounded-lg p-4 border space-y-3">
                          <h4 className="font-semibold text-sm sm:text-base flex items-center">
                            <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                            Equipo Seleccionado
                          </h4>
                          <div className="grid sm:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-500">Nombre</p>
                              <p className="font-medium">{equipoSeleccionado.nombre}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Serial</p>
                              <p className="font-medium">{equipoSeleccionado.serial}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Activo Fijo</p>
                              <p className="font-medium">{equipoSeleccionado.activoFijo}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Marca / Modelo</p>
                              <p className="font-medium">{equipoSeleccionado.marca} / {equipoSeleccionado.modelo}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Responsable</p>
                              <p className="font-medium">{equipoSeleccionado.responsable}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Área</p>
                              <p className="font-medium">{equipoSeleccionado.area}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Sede</p>
                              <p className="font-medium">{equipoSeleccionado.sede}</p>
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button 
                          type="button" 
                          onClick={nextTab}
                          className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                        >
                          Siguiente
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="detalles" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center mb-2">
                              <Settings className="h-4 w-4 mr-2 text-gray-500" />
                              <FormLabel>Tipo de mantenimiento</FormLabel>
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar tipo" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="preventivo">Preventivo</SelectItem>
                                <SelectItem value="correctivo">Correctivo</SelectItem>
                                <SelectItem value="predictivo">Predictivo</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="prioridad"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center mb-2">
                              <ClipboardPen className="h-4 w-4 mr-2 text-gray-500" />
                              <FormLabel>Prioridad</FormLabel>
                            </div>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar prioridad" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="alta">Alta</SelectItem>
                                <SelectItem value="media">Media</SelectItem>
                                <SelectItem value="baja">Baja</SelectItem>
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="sede"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <FormLabel>Sede</FormLabel>
                          </div>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar sede" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sedesMock.map((sede) => (
                                <SelectItem key={sede.id} value={sede.id}>
                                  {sede.nombre}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="responsable"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center mb-2">
                              <User className="h-4 w-4 mr-2 text-gray-500" />
                              <FormLabel>Responsable del equipo</FormLabel>
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar responsable" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {responsablesMock.map((responsable) => (
                                  <SelectItem key={responsable.id} value={responsable.id}>
                                    {responsable.nombre} - {responsable.cargo}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="tecnico"
                        render={({ field }) => (
                          <FormItem>
                            <div className="flex items-center mb-2">
                              <UserRound className="h-4 w-4 mr-2 text-gray-500" />
                              <FormLabel>Técnico asignado</FormLabel>
                            </div>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar técnico" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {tecnicosMock.map((tecnico) => (
                                  <SelectItem key={tecnico.id} value={tecnico.id}>
                                    {tecnico.nombre} - {tecnico.especialidad}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="descripcion"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <FormLabel>Descripción del mantenimiento</FormLabel>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Describa detalladamente el mantenimiento a realizar"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={previousTab}
                      >
                        Anterior
                      </Button>
                      <Button 
                        type="button"
                        onClick={nextTab}
                        className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                      >
                        Siguiente
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="programacion" className="space-y-4 mt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2 text-gray-500" />
                          <Label>Fecha programada</Label>
                        </div>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {fechaProgramada ? format(fechaProgramada, "PPP") : "Seleccionar fecha"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <CalendarComponent
                              mode="single"
                              selected={fechaProgramada}
                              onSelect={setFechaProgramada}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          <Label>Tiempo estimado (horas)</Label>
                        </div>
                        <Select value={tiempoEstimado} onValueChange={setTiempoEstimado}>
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar tiempo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0.5">0.5</SelectItem>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="8">8</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <FormField
                      control={form.control}
                      name="recomendaciones"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <ClipboardList className="h-4 w-4 mr-2 text-gray-500" />
                            <FormLabel>Recomendaciones</FormLabel>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Ingrese recomendaciones para el mantenimiento"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            Incluya instrucciones específicas o recomendaciones para el mantenimiento
                          </FormDescription>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="itemsChequeo"
                      render={() => (
                        <FormItem>
                          <div className="mb-2 sm:mb-4">
                            <div className="flex items-center mb-2">
                              <ClipboardList className="h-4 w-4 mr-2 text-gray-500" />
                              <FormLabel>Lista de Chequeo</FormLabel>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 bg-gray-50 p-4 rounded-lg border">
                            {listadoChequeo.map((item) => (
                              <div key={item} className="flex items-start space-x-2">
                                <Checkbox
                                  id={item}
                                  className="mt-0.5"
                                  onCheckedChange={(checked) => {
                                    const currentItems = form.getValues("itemsChequeo");
                                    if (checked) {
                                      form.setValue("itemsChequeo", [...currentItems, item]);
                                    } else {
                                      form.setValue(
                                        "itemsChequeo",
                                        currentItems.filter((i) => i !== item)
                                      );
                                    }
                                  }}
                                />
                                <label
                                  htmlFor={item}
                                  className="text-xs sm:text-sm font-medium leading-tight"
                                >
                                  {item}
                                </label>
                              </div>
                            ))}
                          </div>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="observaciones"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <FileText className="h-4 w-4 mr-2 text-gray-500" />
                            <FormLabel>Observaciones adicionales</FormLabel>
                          </div>
                          <FormControl>
                            <Textarea
                              placeholder="Ingrese observaciones adicionales"
                              className="min-h-[80px]"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <div className="flex justify-between pt-2">
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={previousTab}
                      >
                        Anterior
                      </Button>
                      <Button 
                        type="submit" 
                        className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                      >
                        Crear Mantenimiento
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]" 
          onClick={() => navigate("/mantenimientos/programacion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Programación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Programa y gestiona los mantenimientos preventivos y correctivos.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]" 
          onClick={() => navigate("/mantenimientos/ejecucion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <Settings className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Ejecución</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Registra y actualiza los mantenimientos en curso.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]" 
          onClick={() => navigate("/mantenimientos/documentacion")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Documentación</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Gestiona la documentación y evidencias de los mantenimientos.
            </p>
          </CardContent>
        </Card>

        <Card 
          className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036]" 
          onClick={() => navigate("/mantenimientos/auditoria")}
        >
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Auditoría</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Revisa y audita los mantenimientos realizados.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MantenimientosIndex;
