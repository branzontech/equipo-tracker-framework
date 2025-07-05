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
import { SearchSelect } from "@/components/SearchSelect";
import { useUser } from "../usuarios/hooks/use-user";
import React, { useState } from "react";
import { ChecklistItem } from "../configuracion/checklist/views/CheckListItem";
import { useChecklist } from "../configuracion/checklist/hooks/use-checklist";

export const ListaChequeo = () => {
  const [modoPlantilla, setModoPlantilla] = useState(true);

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
    setTecnicoResponsable,
    setNewMante,
    setItemsChecklist,
  } = useMantenimiento();
  const { create, checklist, newCheckList, setNewCheckList } = useChecklist();

  const camposPorTipo: Record<"EQUIPO" | "PERIFERICO" | "IMPRESORA", string[]> =
    {
      EQUIPO: [
        "Limpieza de hardware",
        "Actualización de Software",
        "Verificación de Componentes",
        "Pruebas de rendimiento",
        "Respaldo de información",
      ],
      PERIFERICO: ["Conectividad", "Integridad física", "Compatibilidad"],
      IMPRESORA: ["Tóner", "Cabezal", "Papel atascado"],
    };

  function generarItemsChecklist(campos: string[]): {
    id: string;
    texto: string;
    tipo: "checkbox" | "numeric" | "text";
    checked: boolean;
    personalizado: boolean;
  }[] {
    return campos.map((texto, index) => ({
      id: (index + 1).toString(),
      texto,
      tipo: "checkbox", // ya toma el tipo correcto
      checked: false,
      personalizado: false,
    }));
  }

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

        <div className="flex-1 overflow-y-auto space-y-6 mt-4">
          <div className="space-y-4 border rounded-lg p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 space-y-2">
                <Label>Tipo de Equipo</Label>
                <Select
                  value={newCheckList.tipo_equipo || ""}
                  onValueChange={(
                    value: "EQUIPO" | "PERIFERICO" | "IMPRESORA"
                  ) => {
                    const nuevosCampos = camposPorTipo[value];
                    setNewCheckList({
                      ...newCheckList,
                      tipo_equipo: value,
                      campos: nuevosCampos,
                    });
                    setItemsChecklist(generarItemsChecklist(nuevosCampos));
                  }}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccionar tipo de equipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EQUIPO">Equipo</SelectItem>
                    <SelectItem value="PERIFERICO">Periférico</SelectItem>
                    <SelectItem value="IMPRESORA">Impresora</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h4 className="font-semibold flex items-center">
                <ClipboardList className="h-4 w-4 mr-2" />
                Lista de Chequeo
              </h4>

              {modoPlantilla && (
                <div className="flex items-center gap-2 flex-wrap">
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
              )}
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
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      eliminarItemPersonalizado={eliminarItemPersonalizado}
                      toggleChecklistItem={toggleChecklistItem}
                      updateItemValue={updateItemValue}
                      modoPlantilla={modoPlantilla}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {itemsChecklist.map((item) => (
                    <ChecklistItem
                      key={item.id}
                      item={item}
                      eliminarItemPersonalizado={eliminarItemPersonalizado}
                      toggleChecklistItem={toggleChecklistItem}
                      updateItemValue={updateItemValue}
                      modoPlantilla={modoPlantilla}
                    />
                  ))}
                </div>
              )}
            </div>

            {modoPlantilla && (
              <div className="space-y-2">
                <Label>Guardar como Plantilla</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Nombre de la plantilla..."
                    value={newCheckList.nombre}
                    onChange={(e) =>
                      setNewCheckList({
                        ...newCheckList,
                        nombre: e.target.value,
                      })
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      create(newCheckList);
                    }}
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
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
