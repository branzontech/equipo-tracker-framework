import { useState } from "react";
import { Calendar, ChevronLeft, Plus, Filter, Search, ListFilter, CheckSquare, Square } from "lucide-react";
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

const equiposMock = [
  { id: 1, nombre: "Laptop Dell XPS", tipo: "Laptop", sede: "Sede 1", area: "Sistemas", estado: "Activo" },
  { id: 2, nombre: "Impresora HP LaserJet", tipo: "Impresora", sede: "Sede 2", area: "Administración", estado: "Activo" },
  { id: 3, nombre: "Monitor LG 27'", tipo: "Monitor", sede: "Sede 1", area: "Ventas", estado: "Activo" },
  { id: 4, nombre: "Desktop Lenovo", tipo: "Desktop", sede: "Sede 3", area: "Recursos Humanos", estado: "Activo" },
  { id: 5, nombre: "Servidor Dell PowerEdge", tipo: "Servidor", sede: "Sede 1", area: "IT", estado: "Activo" },
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
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Programación de Mantenimientos</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
          <SelectTrigger className="w-[200px]">
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
            <Button className="bg-[#040d50]">
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Mantenimiento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Programar Nuevo Mantenimiento</DialogTitle>
              <DialogDescription>
                Complete los detalles para programar un nuevo mantenimiento.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <Tabs defaultValue="general" className="w-full">
                  <TabsList className="w-full">
                    <TabsTrigger value="general" className="flex-1">Información General</TabsTrigger>
                    <TabsTrigger value="equipos" className="flex-1">Equipos</TabsTrigger>
                    <TabsTrigger value="detalles" className="flex-1">Detalles Adicionales</TabsTrigger>
                  </TabsList>

                  <TabsContent value="general" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="sede"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Sede</FormLabel>
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
                            <FormLabel>Bodega</FormLabel>
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
                            <FormLabel>Tipo de Registro</FormLabel>
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

                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="tipo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tipo de Mantenimiento</FormLabel>
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
                            <FormLabel>Periodicidad</FormLabel>
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

                  <TabsContent value="equipos" className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <FormLabel>Búsqueda</FormLabel>
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
                        <div className="w-[200px]">
                          <FormLabel>Sede</FormLabel>
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
                        <div className="w-[200px]">
                          <FormLabel>Área</FormLabel>
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
                        <div className="w-[200px]">
                          <FormLabel>Tipo</FormLabel>
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

                      <div className="border rounded-md">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-[50px]">
                                <Checkbox
                                  checked={selectAll}
                                  onCheckedChange={handleSelectAll}
                                />
                              </TableHead>
                              <TableHead>Equipo</TableHead>
                              <TableHead>Tipo</TableHead>
                              <TableHead>Sede</TableHead>
                              <TableHead>Área</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {equiposFiltrados.length === 0 ? (
                              <TableRow>
                                <TableCell colSpan={5} className="text-center text-muted-foreground">
                                  No se encontraron equipos con los filtros seleccionados
                                </TableCell>
                              </TableRow>
                            ) : (
                              equiposFiltrados.map((equipo) => (
                                <TableRow key={equipo.id}>
                                  <TableCell>
                                    <Checkbox
                                      checked={selectedEquipos.includes(equipo.id)}
                                      onCheckedChange={() => handleSelectEquipo(equipo.id)}
                                    />
                                  </TableCell>
                                  <TableCell>{equipo.nombre}</TableCell>
                                  <TableCell>{equipo.tipo}</TableCell>
                                  <TableCell>{equipo.sede}</TableCell>
                                  <TableCell>{equipo.area}</TableCell>
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

                  <TabsContent value="detalles" className="space-y-4">
                    <FormField
                      control={form.control}
                      name="fechaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha de Inicio</FormLabel>
                          <FormControl>
                            <CalendarComponent
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              locale={es}
                              className="rounded-md border"
                            />
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
                          <FormLabel>Responsable</FormLabel>
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
                          <FormLabel>Descripción</FormLabel>
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

                <div className="flex justify-end gap-2 pt-4">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit" className="bg-[#040d50]">
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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo</TableHead>
                <TableHead className="text-[#040d50]">Fecha Programada</TableHead>
                <TableHead className="text-[#040d50]">Responsable</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Aquí irían los datos de mantenimientos programados */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramacionMantenimiento;
