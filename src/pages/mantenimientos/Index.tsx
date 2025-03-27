
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, ClipboardList, FileText, Settings, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface Equipo {
  id: string;
  nombre: string;
  serial: string;
  responsable: string;
  area: string;
}

const equiposMock: Equipo[] = [
  { id: "1", nombre: "Laptop Dell XPS", serial: "XPS123", responsable: "Juan Pérez", area: "Sistemas" },
  { id: "2", nombre: "Impresora HP", serial: "HP456", responsable: "María García", area: "Administración" },
  // Agrega más equipos mock según necesites
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

  const form = useForm({
    defaultValues: {
      equipo: "",
      itemsChequeo: [] as string[],
      descripcion: "",
      observaciones: "",
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
  };

  const onSubmit = (data: any) => {
    if (!equipoSeleccionado) {
      toast.error("Debe seleccionar un equipo");
      return;
    }
    console.log({ ...data, equipo: equipoSeleccionado });
    toast.success("Mantenimiento creado exitosamente");
    setIsDialogOpen(false);
    form.reset();
    setEquipoSeleccionado(null);
    setBusqueda("");
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
          <DialogContent className="w-[90vw] max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl">Nuevo Mantenimiento</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Label className="text-sm sm:text-base">Buscar Equipo</Label>
                    <Input
                      placeholder="Buscar por nombre, serial, responsable o área"
                      value={busqueda}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full mt-1.5"
                    />
                    {equiposFiltrados.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-48 sm:max-h-60 overflow-auto">
                        {equiposFiltrados.map((equipo) => (
                          <div
                            key={equipo.id}
                            className="p-2 sm:p-3 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectEquipo(equipo)}
                          >
                            <div className="font-medium text-sm sm:text-base">{equipo.nombre}</div>
                            <div className="text-xs sm:text-sm text-gray-600">
                              Serial: {equipo.serial} | Responsable: {equipo.responsable} | Área: {equipo.area}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {equipoSeleccionado && (
                    <div className="p-3 bg-gray-50 rounded-md text-sm sm:text-base">
                      <h4 className="font-medium mb-1">Equipo Seleccionado:</h4>
                      <p className="text-xs sm:text-sm">
                        {equipoSeleccionado.nombre} - Serial: {equipoSeleccionado.serial}
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="itemsChequeo"
                    render={() => (
                      <FormItem>
                        <div className="mb-2 sm:mb-4">
                          <FormLabel className="text-sm sm:text-base">Lista de Chequeo</FormLabel>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                    name="descripcion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Descripción del Mantenimiento</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el mantenimiento a realizar"
                            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="observaciones"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm sm:text-base">Observaciones Adicionales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Agrega observaciones o notas importantes"
                            className="min-h-[80px] sm:min-h-[100px] text-sm sm:text-base"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full text-sm sm:text-base py-2 sm:py-2.5">
                  Crear Mantenimiento
                </Button>
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

