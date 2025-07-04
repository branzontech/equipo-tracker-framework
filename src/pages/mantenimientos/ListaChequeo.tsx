import {
  ClipboardList,
  Plus,
  Search,
  Calendar as CalendarIcon,
  Building,
  User,
  Grid3X3,
  List,
  Star,
  BookOpen,
  Save,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { useSedes } from "../configuracion/maestros/hooks/use-sedes";

export const ListaChequeo = () => {
  const {
    handleSearchChecklist,
    selectEquipoChecklist,
    toggleChecklistItem,
    updateItemValue,
    agregarItemPersonalizado,
    eliminarItemPersonalizado,
    guardarPlantilla,
    completarChecklist,
    isChecklistDialogOpen,
    setIsChecklistDialogOpen,
    equipoChecklistSeleccionado,
    busquedaChecklist,
    sedeFilterChecklist,
    equiposChecklistFiltrados,
    handleSedeFilterChecklist,
    tipoVista,
    setTipoVista,
    vistaColumnas,
    setVistaColumnas,
    setTipoCalificacion,
    setTipoNuevoItem,
    tipoNuevoItem,
    nuevoItemPersonalizado,
    setNuevoItemPersonalizado,
    itemsChecklist,
    tipoCalificacion,
    calificacionEquipo,
    calificacionEscala,
    calificacionCategorica,
    observacionesChecklist,
    nombrePlantilla,
    fechaEjecucion,
    setCalificacionCategorica,
    setCalificacionEscala,
    setCalificacionEquipo,
    setObservacionesChecklist,
    setNombrePlantilla,
  } = useMantenimiento();
  const { sedes } = useSedes();

  return (
    <Dialog
      open={isChecklistDialogOpen}
      onOpenChange={setIsChecklistDialogOpen}
    >
      <DialogTrigger asChild>
        <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-[#bff036] text-[#01242c]">
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg text-[#01242c]">
              <ClipboardList className="h-4 w-4 sm:h-5 sm:w-5 text-[#01242c]" />
              <span>Lista de Chequeo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 pt-0">
            <p className="text-xs sm:text-sm text-[#01242c] opacity-90">
              Realizar chequeos de mantenimiento con listas personalizables.
            </p>
          </CardContent>
        </Card>
      </DialogTrigger>

      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-4 sm:p-6 bg-white">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">
            Lista de Chequeo de Mantenimiento
          </DialogTitle>
          <DialogDescription>
            Seleccione un equipo y complete la lista de chequeo
          </DialogDescription>
        </DialogHeader>

        {/* Contenido scrollable */}
        <div className="flex-1 overflow-y-auto space-y-6 mt-4">
          {/* Filtros */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Buscar por Serial o Nombre</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar equipo..."
                  value={busquedaChecklist}
                  onChange={(e) => handleSearchChecklist(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-1">
              <Label>Filtrar por Sede</Label>
              <Select
                value={sedeFilterChecklist}
                onValueChange={handleSedeFilterChecklist}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sede" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las sedes</SelectItem>
                  {sedes.map((sede) => (
                    <SelectItem
                      key={sede.id_sede}
                      value={sede.id_sede.toString()}
                    >
                      {sede.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Lista de equipos */}
          {equiposChecklistFiltrados.length > 0 && (
            <div className="border rounded-lg max-h-64 overflow-y-auto">
              {equiposChecklistFiltrados.map((equipo) => (
                <div
                  key={equipo.id_equipo}
                  className="p-3 hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick={() => selectEquipoChecklist(equipo)}
                >
                  <div className="font-medium">{equipo.nombre_equipo}</div>
                  <div className="text-sm text-gray-600">
                    Serial: {equipo.nro_serie} | Sede: {equipo?.sedes}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Detalle del equipo seleccionado */}
          {equipoChecklistSeleccionado && (
            <div className="bg-gray-50 rounded-lg p-4 border space-y-4">
              <h4 className="font-semibold mb-3 flex items-center">
                <Building className="h-4 w-4 mr-2" />
                Información del Mantenimiento
              </h4>

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500">Equipo</p>
                  <p className="font-medium">
                    {equipoChecklistSeleccionado.nombre_equipo}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Serial</p>
                  <p className="font-medium">
                    {equipoChecklistSeleccionado.nro_serie}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Sede</p>
                  <p className="font-medium">
                    {equipoChecklistSeleccionado?.sedes}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Responsable del Equipo</p>
                  <p className="font-medium">
                    {
                      equipoChecklistSeleccionado?.estado_ubicacion?.[0]
                        ?.usuarios?.nombre
                    }
                  </p>
                </div>
              </div>

              <Separator />

              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-500 flex items-center gap-1">
                    <CalendarIcon className="h-3 w-3" />
                    Fecha de Ejecución
                  </p>
                  <p className="font-medium">
                    {format(fechaEjecucion, "dd/MM/yyyy HH:mm")}
                  </p>
                </div>

                {/* FUTURO: Técnico responsable */}
                {/* <div>
              <p className="text-gray-500 flex items-center gap-1">
                <User className="h-3 w-3" />
                Técnico Responsable
              </p>
              <Select value={tecnicoResponsable} onValueChange={setTecnicoResponsable}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Seleccionar técnico" />
                </SelectTrigger>
                <SelectContent>
                  {tecnicosMock.map((tecnico) => (
                    <SelectItem key={tecnico.id} value={tecnico.nombre}>
                      {tecnico.nombre} - {tecnico.especialidad}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div> */}
              </div>
            </div>
          )}

          {/* Lista de Chequeo */}
          {equipoChecklistSeleccionado && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h4 className="font-semibold flex items-center">
                  <ClipboardList className="h-4 w-4 mr-2" />
                  Lista de Chequeo
                </h4>

                <div className="flex items-center gap-2 flex-wrap">
                  {/* Controles de vista */}
                  <div className="flex items-center gap-1 border rounded-lg p-1">
                    <Button
                      type="button"
                      variant={tipoVista === "grid" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTipoVista("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant={tipoVista === "list" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setTipoVista("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Selector de columnas (solo para vista grid) */}
                  {tipoVista === "grid" && (
                    <Select
                      value={vistaColumnas}
                      onValueChange={(value: "1" | "2" | "3") =>
                        setVistaColumnas(value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Columna</SelectItem>
                        <SelectItem value="2">2 Columnas</SelectItem>
                        <SelectItem value="3">3 Columnas</SelectItem>
                      </SelectContent>
                    </Select>
                  )}

                  <div className="flex gap-2 flex-wrap">
                    <Select
                      value={tipoNuevoItem}
                      onValueChange={(value: "checkbox" | "numeric" | "text") =>
                        setTipoNuevoItem(value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="checkbox">Checkbox</SelectItem>
                        <SelectItem value="numeric">Numérico</SelectItem>
                        <SelectItem value="text">Texto</SelectItem>
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Agregar campo personalizado..."
                      value={nuevoItemPersonalizado}
                      onChange={(e) =>
                        setNuevoItemPersonalizado(e.target.value)
                      }
                      className="w-64"
                    />
                    <Button
                      type="button"
                      onClick={agregarItemPersonalizado}
                      className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="border rounded-lg p-4 max-h-80 overflow-y-auto">
                {tipoVista === "grid" ? (
                  <div
                    className={`grid gap-3 ${
                      vistaColumnas === "1"
                        ? "grid-cols-1"
                        : vistaColumnas === "2"
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
                    }`}
                  >
                    {itemsChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {item.texto}
                            </span>
                            {item.personalizado && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Personalizado
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {item.tipo === "checkbox"
                                ? "Checkbox"
                                : item.tipo === "numeric"
                                ? "Numérico"
                                : "Texto"}
                            </span>
                          </div>
                          {item.personalizado && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarItemPersonalizado(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          )}
                        </div>

                        {/* Campo según el tipo */}
                        {item.tipo === "checkbox" ? (
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={item.checked || false}
                              onCheckedChange={() =>
                                toggleChecklistItem(item.id)
                              }
                            />
                            <span
                              className={`text-sm ${
                                item.checked ? "line-through text-gray-500" : ""
                              }`}
                            >
                              Completado
                            </span>
                          </div>
                        ) : item.tipo === "numeric" ? (
                          <Input
                            type="number"
                            placeholder="Ingrese valor numérico"
                            value={item.valor || ""}
                            onChange={(e) =>
                              updateItemValue(item.id, Number(e.target.value))
                            }
                            className="w-full"
                          />
                        ) : (
                          <Input
                            type="text"
                            placeholder="Ingrese texto"
                            value={item.valor || ""}
                            onChange={(e) =>
                              updateItemValue(item.id, e.target.value)
                            }
                            className="w-full"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {itemsChecklist.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 hover:bg-gray-50 rounded-lg transition-colors border-b last:border-b-0 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium">
                              {item.texto}
                            </span>
                            {item.personalizado && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                                Personalizado
                              </span>
                            )}
                            <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                              {item.tipo === "checkbox"
                                ? "Checkbox"
                                : item.tipo === "numeric"
                                ? "Numérico"
                                : "Texto"}
                            </span>
                          </div>
                          {item.personalizado && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => eliminarItemPersonalizado(item.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              ×
                            </Button>
                          )}
                        </div>

                        {/* Campo según el tipo */}
                        <div className="ml-0">
                          {item.tipo === "checkbox" ? (
                            <div className="flex items-center space-x-2">
                              <Checkbox
                                checked={item.checked || false}
                                onCheckedChange={() =>
                                  toggleChecklistItem(item.id)
                                }
                              />
                              <span
                                className={`text-sm ${
                                  item.checked
                                    ? "line-through text-gray-500"
                                    : ""
                                }`}
                              >
                                Completado
                              </span>
                            </div>
                          ) : item.tipo === "numeric" ? (
                            <Input
                              type="number"
                              placeholder="Ingrese valor numérico"
                              value={item.valor || ""}
                              onChange={(e) =>
                                updateItemValue(item.id, Number(e.target.value))
                              }
                              className="w-full max-w-xs"
                            />
                          ) : (
                            <Input
                              type="text"
                              placeholder="Ingrese texto"
                              value={item.valor || ""}
                              onChange={(e) =>
                                updateItemValue(item.id, e.target.value)
                              }
                              className="w-full"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Calificación del Equipo */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Calificación del Estado del Equipo</Label>
                  <Select
                    value={tipoCalificacion}
                    onValueChange={(
                      value: "estrellas" | "escala" | "categorica"
                    ) => setTipoCalificacion(value)}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="estrellas">
                        ⭐ Estrellas (1-5)
                      </SelectItem>
                      <SelectItem value="escala">🔢 Escala (1-10)</SelectItem>
                      <SelectItem value="categorica">📋 Categórica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Calificación por Estrellas */}
                {tipoCalificacion === "estrellas" && (
                  <div className="flex items-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-6 w-6 cursor-pointer transition-colors ${
                          star <= calificacionEquipo
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300 hover:text-yellow-200"
                        }`}
                        onClick={() => setCalificacionEquipo(star)}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      ({calificacionEquipo} de 5 estrellas)
                    </span>
                  </div>
                )}

                {/* Calificación por Escala 1-10 */}
                {tipoCalificacion === "escala" && (
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-red-500 font-medium">
                        1 (Malo)
                      </span>
                      <div className="flex-1">
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={calificacionEscala}
                          onChange={(e) =>
                            setCalificacionEscala(Number(e.target.value))
                          }
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        />
                      </div>
                      <span className="text-sm text-green-500 font-medium">
                        10 (Excelente)
                      </span>
                    </div>
                    <div className="text-center">
                      <span className="text-lg font-bold text-gray-700">
                        Calificación: {calificacionEscala}/10
                      </span>
                      <span className="block text-sm text-gray-500">
                        {calificacionEscala <= 3
                          ? "Malo"
                          : calificacionEscala <= 7
                          ? "Regular"
                          : "Excelente"}
                      </span>
                    </div>
                  </div>
                )}

                {/* Calificación Categórica */}
                {tipoCalificacion === "categorica" && (
                  <div className="space-y-2">
                    <div className="grid grid-cols-3 gap-2">
                      {(["malo", "bueno", "excelente"] as const).map(
                        (categoria) => (
                          <Button
                            key={categoria}
                            type="button"
                            variant={
                              calificacionCategorica === categoria
                                ? "default"
                                : "outline"
                            }
                            onClick={() => setCalificacionCategorica(categoria)}
                            className={`capitalize ${
                              calificacionCategorica === categoria
                                ? categoria === "malo"
                                  ? "bg-red-500 hover:bg-red-600"
                                  : categoria === "bueno"
                                  ? "bg-yellow-500 hover:bg-yellow-600"
                                  : "bg-green-500 hover:bg-green-600"
                                : ""
                            }`}
                          >
                            {categoria === "malo"
                              ? "😞 Malo"
                              : categoria === "bueno"
                              ? "😐 Bueno"
                              : "😄 Excelente"}
                          </Button>
                        )
                      )}
                    </div>
                    <div className="text-center text-sm text-gray-600">
                      Estado seleccionado:{" "}
                      <span className="font-semibold capitalize">
                        {calificacionCategorica}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Observaciones */}
              <div className="space-y-2">
                <Label>Observaciones</Label>
                <Textarea
                  placeholder="Ingrese observaciones adicionales..."
                  value={observacionesChecklist}
                  onChange={(e) => setObservacionesChecklist(e.target.value)}
                  className="min-h-[80px]"
                />
              </div>

              {/* Guardar como Plantilla */}
              <div className="space-y-2">
                <Label>Guardar como Plantilla</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Nombre de la plantilla..."
                    value={nombrePlantilla}
                    onChange={(e) => setNombrePlantilla(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={guardarPlantilla}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <BookOpen className="h-4 w-4" />
                    Guardar Plantilla
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  La plantilla guardará los campos personalizados y el tipo de
                  calificación seleccionado
                </p>
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsChecklistDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button
                  type="button"
                  onClick={completarChecklist}
                  className="bg-[#bff036] text-[#01242c] hover:bg-[#a8d72f]"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Completar Checklist
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
