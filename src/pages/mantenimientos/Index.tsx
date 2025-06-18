import { useNavigate } from "react-router-dom";
import {
  Calendar,
  ClipboardList,
  FileText,
  Settings,
  Plus,
  Search,
  UserRound,
  Calendar as CalendarIcon,
  Clock,
} from "lucide-react";
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
import { FormControl, FormDescription } from "@/components/ui/form";
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
import { useEquipos } from "../productos/hooks/use-equipos";
import { Equipo } from "../productos/interfaces/equipo";
import { useState } from "react";
import { useUser } from "../usuarios/hooks/use-user";
import { useMantenimiento } from "./hooks/use-mantenimiento";

const MantenimientosIndex = () => {
  const navigate = useNavigate();
  const {
    newMante,
    setNewMante,
    currentTab,
    isDialogOpen,
    setIsDialogOpen,
    nextTab,
    previousTab,
    handleTabChange,
    equipoSeleccionado,
    setEquipoSeleccionado,
    onSubmit,
  } = useMantenimiento();
  const { equipo, newEquipo, setNewEquipo, setEquipo } = useEquipos();
  const { users } = useUser();

  const selectEquipo = (equipo: Equipo) => {
    setEquipoSeleccionado(equipo);
    setNewMante((prev) => ({ ...prev, id_equipo: equipo.id_equipo }));
    setNewEquipo((prev) => ({ ...prev, nro_serie: "" }));
    setEquipo([]);
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
              <DialogTitle className="text-lg sm:text-xl">
                Nuevo Mantenimiento
              </DialogTitle>
              <DialogDescription>
                Complete la información para programar un nuevo mantenimiento
              </DialogDescription>
            </DialogHeader>
            <form
              className="space-y-4 sm:space-y-6 mt-4"
              onSubmit={(e: React.FormEvent) => {
                e.preventDefault();
                onSubmit(newMante);
              }}
            >
              <Tabs
                value={currentTab}
                onValueChange={handleTabChange}
                className="w-full"
              >
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
                        <Label className="text-sm sm:text-base font-medium">
                          Buscar Equipo
                        </Label>
                      </div>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          placeholder="Buscar por nombre o serial"
                          value={newEquipo.nro_serie}
                          onChange={(e) =>
                            setNewEquipo({
                              ...newEquipo,
                              nro_serie: e.target.value,
                            })
                          }
                          className="w-full pl-10 mt-1"
                        />
                      </div>
                      {newEquipo.nro_serie.trim() !== "" &&
                        equipo.length > 0 && (
                          <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                            {equipo.map((equipo) => (
                              <div
                                key={equipo.id_equipo}
                                className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                                onClick={() => selectEquipo(equipo)}
                              >
                                <div className="font-medium text-sm sm:text-base">
                                  {equipo.nombre_equipo}
                                </div>
                                <div className="text-xs sm:text-sm text-gray-600 mt-1">
                                  <div className="grid grid-cols-2 gap-2">
                                    <span>
                                      <span className="font-semibold">
                                        Serial:
                                      </span>{" "}
                                      {equipo.nro_serie}
                                    </span>
                                    <span>
                                      <span className="font-semibold">
                                        Tipo de activo:
                                      </span>{" "}
                                      {equipo.tipo_activo}
                                    </span>
                                    <span>
                                      <span className="font-semibold">
                                        Marca:
                                      </span>{" "}
                                      {equipo.marcas}
                                    </span>
                                    <span>
                                      <span className="font-semibold">
                                        Modelo:
                                      </span>{" "}
                                      {equipo.modelo}
                                    </span>
                                    <span>
                                      <span className="font-semibold">
                                        Sede:
                                      </span>{" "}
                                      {equipo.sedes}
                                    </span>
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
                            <p className="font-medium">
                              {equipoSeleccionado.nombre_equipo}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Serial</p>
                            <p className="font-medium">
                              {equipoSeleccionado.nro_serie}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Tipo de activo</p>
                            <p className="font-medium">
                              {equipoSeleccionado.tipo_activo}
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-500">Marca / Modelo</p>
                            <p className="font-medium">
                              {equipoSeleccionado.marcas} /{" "}
                              {equipoSeleccionado.modelo}
                            </p>
                          </div>
                          {/* <div>
                            <p className="text-gray-500">Responsable</p>
                            <p className="font-medium">{equipoSeleccionado.responsable}</p>
                          </div> */}
                          {/* <div>
                            <p className="text-gray-500">Área</p>
                            <p className="font-medium">{equipoSeleccionado.area}</p>
                          </div> */}
                          <div>
                            <p className="text-gray-500">Sede</p>
                            <p className="font-medium">
                              {equipoSeleccionado.sedes}
                            </p>
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
                    <div className="space-y-2">
                      <Label htmlFor="tipo">Tipo de mantenimiento</Label>
                      <Select
                        value={newMante.tipo ? newMante.tipo : ""}
                        onValueChange={(value) =>
                          setNewMante({ ...newMante, tipo: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Preventivo">Preventivo</SelectItem>
                          <SelectItem value="Correctivo">Correctivo</SelectItem>
                          <SelectItem value="Predictivo">Predictivo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="prioridad">Prioridad</Label>
                      <Select
                        value={newMante.prioridad ? newMante.prioridad : ""}
                          onValueChange={(value) => setNewMante({ ...newMante, prioridad: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* <FormField
                      control={form.control}
                      name="sede"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center mb-2">
                            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                            <FormLabel>Sede</FormLabel>
                          </div>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
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
                    /> */}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2 col-span-2">
                      <Label htmlFor="tecnico">Técnico asignado</Label>
                      <Select
                        value={
                          newMante.tecnico_id
                            ? newMante.tecnico_id.toString()
                            : ""
                        }
                          onValueChange={(value) => setNewMante({ ...newMante, tecnico_id: Number(value) })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar técnico" />
                        </SelectTrigger>
                        <SelectContent>
                          {users.map((tecnico) => (
                            <SelectItem
                              key={tecnico.id_usuario}
                              value={tecnico.id_usuario.toString()}
                            >
                              {tecnico.nombre} - {tecnico.rol}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="descripcion">
                      Descripción del mantenimiento
                    </Label>
                    <Textarea
                      id="descripcion"
                      placeholder="Describa detalladamente el mantenimiento a realizar"
                      rows={4}
                      value={newMante.descripcion}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          descripcion: e.target.value,
                        });
                      }}
                    />
                  </div>

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
                            {newMante.fecha_programada
                              ? format(newMante.fecha_programada, "PPP")
                              : "Seleccionar fecha"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <CalendarComponent
                            mode="single"
                            selected={newMante.fecha_programada as Date}
                            onSelect={(date) =>
                              setNewMante({
                                ...newMante,
                                fecha_programada: date as Date,
                              })
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center mb-4">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <Label>Tiempo estimado (horas)</Label>
                      </div>
                      <Select
                        value={newMante.tiempo_estimado.toString()}
                        onValueChange={(value) =>
                          setNewMante({
                            ...newMante,
                            tiempo_estimado: Number(value),
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tiempo" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1</SelectItem>
                          <SelectItem value="2">2</SelectItem>
                          <SelectItem value="3">3</SelectItem>
                          <SelectItem value="4">4</SelectItem>
                          <SelectItem value="8">8</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="recomendaciones">Recomendaciones</Label>
                    <Textarea
                      id="recomendaciones"
                      placeholder="Ingrese recomendaciones para el mantenimiento"
                      rows={4}
                      value={newMante.recomendaciones}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          recomendaciones: e.target.value,
                        });
                      }}
                    />
                    {/* <FormDescription className="text-xs">
                      Incluya instrucciones específicas o recomendaciones para
                      el mantenimiento
                    </FormDescription> */}
                  </div>

                  {/* <FormField
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
                            <div
                              key={item}
                              className="flex items-start space-x-2"
                            >
                              <Checkbox
                                id={item}
                                className="mt-0.5"
                                onCheckedChange={(checked) => {
                                  const currentItems =
                                    form.getValues("itemsChequeo");
                                  if (checked) {
                                    form.setValue("itemsChequeo", [
                                      ...currentItems,
                                      item,
                                    ]);
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
                  /> */}

                  <div className="space-y-2">
                    <Label htmlFor="observaciones">
                      Observaciones adicionales
                    </Label>
                    <Textarea
                      id="observaciones"
                      placeholder="Ingrese observaciones adicionales"
                      rows={4}
                      value={newMante.observaciones_adi}
                      onChange={(e) => {
                        setNewMante({
                          ...newMante,
                          observaciones_adi: e.target.value,
                        });
                      }}
                    />
                  </div>

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
