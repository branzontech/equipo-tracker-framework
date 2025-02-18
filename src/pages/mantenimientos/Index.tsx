
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
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Gestión de Mantenimientos</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-[#040d50] text-white">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>Nuevo Mantenimiento</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm opacity-90">Crear un nuevo registro de mantenimiento para un equipo.</p>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nuevo Mantenimiento</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <Label>Buscar Equipo</Label>
                    <Input
                      placeholder="Buscar por nombre, serial, responsable o área"
                      value={busqueda}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full"
                    />
                    {equiposFiltrados.length > 0 && (
                      <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                        {equiposFiltrados.map((equipo) => (
                          <div
                            key={equipo.id}
                            className="p-2 hover:bg-gray-100 cursor-pointer"
                            onClick={() => selectEquipo(equipo)}
                          >
                            <div className="font-medium">{equipo.nombre}</div>
                            <div className="text-sm text-gray-600">
                              Serial: {equipo.serial} | Responsable: {equipo.responsable} | Área: {equipo.area}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {equipoSeleccionado && (
                    <div className="p-3 bg-gray-50 rounded-md">
                      <h4 className="font-medium mb-1">Equipo Seleccionado:</h4>
                      <p className="text-sm">
                        {equipoSeleccionado.nombre} - Serial: {equipoSeleccionado.serial}
                      </p>
                    </div>
                  )}

                  <FormField
                    control={form.control}
                    name="itemsChequeo"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel>Lista de Chequeo</FormLabel>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {listadoChequeo.map((item) => (
                            <div key={item} className="flex items-center space-x-2">
                              <Checkbox
                                id={item}
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
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                        <FormLabel>Descripción del Mantenimiento</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Describe el mantenimiento a realizar"
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
                        <FormLabel>Observaciones Adicionales</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Agrega observaciones o notas importantes"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className="w-full">
                  Crear Mantenimiento
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/programacion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Programación</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Programa y gestiona los mantenimientos preventivos y correctivos.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/ejecucion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Ejecución</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Registra y actualiza los mantenimientos en curso.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/documentacion")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Documentación</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gestiona la documentación y evidencias de los mantenimientos.</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/mantenimientos/auditoria")}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5 text-[#040d50]" />
              <span className="text-[#040d50]">Auditoría</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Revisa y audita los mantenimientos realizados.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MantenimientosIndex;
