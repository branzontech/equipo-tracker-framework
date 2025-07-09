/* eslint-disable react-hooks/exhaustive-deps */
import { useMantenimiento } from "@/pages/mantenimientos/hooks/use-mantenimiento";
import { useEffect, useState } from "react";
import { useChecklist } from "../hooks/use-checklist";
import {
  ClipboardList,
  Plus,
  Grid3X3,
  List,
  BookOpen,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChecklistItem } from "./CheckListItem";
import { UpdateProps } from "../../maestros/interfaces/props";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const UpdateCheckList = ({ open, onOpenChange, id }: UpdateProps) => {
  const [modoPlantilla, setModoPlantilla] = useState(true);
  const {
    toggleChecklistItem,
    updateItemValue,
    agregarItemPersonalizado,
    eliminarItemPersonalizado,
    tipoVista,
    setTipoVista,
    vistaColumnas,
    setVistaColumnas,
    setTipoNuevoItem,
    tipoNuevoItem,
    nuevoItemPersonalizado,
    setNuevoItemPersonalizado,
    itemsChecklist,
    setItemsChecklist,
  } = useMantenimiento();
  const {
    create,
    newCheckList,
    setNewCheckList,
    checklistData,
    setChecklistData,
    getByID,
    update,
  } = useChecklist();

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
      tipo: "checkbox",
      checked: false,
      personalizado: false,
    }));
  }

  useEffect(() => {
    if (id !== null) {
      getByID(id);
    }
  }, [id]);

  useEffect(() => {
    if (newCheckList.campos) {
      setItemsChecklist(generarItemsChecklist(newCheckList.campos));
    }
  }, [newCheckList]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] max-w-4xl h-[90vh] max-h-[90vh] flex flex-col p-4 sm:p-6 bg-white">
        <DialogHeader>
          <DialogTitle>Actualizar Plantilla</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          Formulario para actualizar los datos de la plantilla seleccionada.
        </DialogDescription>
        <div className="flex-1 overflow-y-auto space-y-6 mt-4">
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

          <div className="space-y-4">
            {newCheckList.tipo_equipo && (
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
                        onValueChange={(
                          value: "checkbox" | "numeric" | "text"
                        ) => setTipoNuevoItem(value)}
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
            )}

            {newCheckList.tipo_equipo && (
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
                        isUpdate={true}
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
                        isUpdate={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}

            {modoPlantilla && (
              <>
                <div className="flex-1 space-y-2">
                  <Label>Tipo de Calificación</Label>
                  <Select
                    value={newCheckList.tipo_calificacion || ""}
                    onValueChange={(
                      value: "ESTRELLAS" | "ESCALA" | "CATEGORIA"
                    ) =>
                      setNewCheckList({
                        ...newCheckList,
                        tipo_calificacion: value,
                      })
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar tipo de calificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ESTRELLAS">Estrellas</SelectItem>
                      <SelectItem value="ESCALA">Escala 1-10</SelectItem>
                      <SelectItem value="CATEGORIA">Categoría</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {newCheckList.tipo_calificacion && (
                  <div className="space-y-4">
                    <Label>Calificación del Estado del Equipo</Label>

                    {newCheckList.tipo_calificacion === "ESTRELLAS" && (
                      <div className="flex items-center space-x-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-6 w-6 cursor-pointer transition-colors ${
                              star <= (checklistData.calificacion ?? 0)
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300 hover:text-yellow-200"
                            }`}
                            onClick={() =>
                              setChecklistData((prev) => ({
                                ...prev,
                                calificacion: star,
                              }))
                            }
                          />
                        ))}
                        <span className="ml-2 text-sm text-gray-600">
                          ({checklistData.calificacion ?? 0} de 5 estrellas)
                        </span>
                      </div>
                    )}

                    {newCheckList.tipo_calificacion === "ESCALA" && (
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
                              value={checklistData.calificacion ?? 1}
                              onChange={(e) =>
                                setChecklistData((prev) => ({
                                  ...prev,
                                  calificacion: Number(e.target.value),
                                }))
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
                            Calificación: {checklistData.calificacion ?? 1}/10
                          </span>
                          <span className="block text-sm text-gray-500">
                            {(checklistData.calificacion ?? 1) <= 3
                              ? "Malo"
                              : (checklistData.calificacion ?? 1) <= 7
                              ? "Regular"
                              : "Excelente"}
                          </span>
                        </div>
                      </div>
                    )}

                    {newCheckList.tipo_calificacion === "CATEGORIA" && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-3 gap-2">
                          {(["malo", "bueno", "excelente"] as const).map(
                            (categoria, index) => (
                              <Button
                                key={categoria}
                                type="button"
                                variant={
                                  checklistData.calificacion === index + 1
                                    ? "default"
                                    : "outline"
                                }
                                onClick={() =>
                                  setChecklistData((prev) => ({
                                    ...prev,
                                    calificacion: index + 1,
                                  }))
                                }
                                className={`capitalize ${
                                  checklistData.calificacion === index + 1
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
                            {(() => {
                              switch (checklistData.calificacion) {
                                case 1:
                                  return "Malo";
                                case 2:
                                  return "Bueno";
                                case 3:
                                  return "Excelente";
                                default:
                                  return "No seleccionado";
                              }
                            })()}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

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
                        if (id !== null) {
                          const camposFinales = itemsChecklist.map(
                            (item) => item.texto
                          );
                          const data = {
                            ...newCheckList,
                            campos: camposFinales,
                          };
                          update(id, data);
                        }
                      }}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Actualizar Plantilla
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500">
                    La plantilla guardará los campos personalizados y el tipo de
                    calificación seleccionado
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
