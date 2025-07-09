/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import {
  User,
  ClipboardList,
  Upload,
  Loader,
  ArrowLeft,
  Paperclip,
  FileText,
  X,
  Building,
  CalendarIcon,
  Star,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobal } from "@/hooks/use-global";
import {
  actualizarProgreso,
  getCheckListResponses,
  saveResponse,
} from "@/api/axios/mante.api";
import { Textarea } from "@/components/ui/textarea";
import { useChecklist } from "../configuracion/checklist/hooks/use-checklist";
import { toast } from "sonner";
import { icons } from "@/components/interfaces/icons";

const Labels = ({ icon: Icon, text }: { icon: any; text: string }) => (
  <h3 className="flex items-center gap-2 font-semibold text-lg text-gray-800">
    <Icon className="w-4 h-4 text-primary" />
    {text}
  </h3>
);

const MantenimientoDetalle = () => {
  const { id } = useParams();
  const {
    newMante,
    getInfoById,
    setNewMante,
    upload,
    calificacionCategorica,
    setCalificacionCategorica,
    getEstadoBadge,
  } = useMantenimiento();
  const {
    checklistData,
    setChecklistData,
    finalizarChecklist,
    checklistCompleted,
    setChecklistCompleted,
  } = useChecklist();
  const { formatFecha } = useGlobal();
  const navigate = useNavigate();
  const [checkedItems, setCheckedItems] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await getInfoById(id);

        const response = await getCheckListResponses(id);
        if (response?.length > 0 && response[0]?.respuestas) {
          const seleccionados = Object.entries(response[0].respuestas)
            .filter(([, completado]) => completado)
            .map(([campo]) => campo);

          setCheckedItems(seleccionados);

          const { observaciones, calificacion } = response[0];
          setChecklistData({
            ...checklistData,
            observaciones: observaciones ?? "",
            calificacion: calificacion ?? null,
          });

          setChecklistCompleted(Boolean(calificacion));
        }
      } catch (error) {
        console.error("Error cargando datos del mantenimiento:", error);
      }
    };

    fetchData();
  }, [id]);

  if (!newMante?.id_mantenimiento) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        <Loader className="w-5 h-5 animate-spin inline-block mr-2" />
        Cargando mantenimiento...
      </div>
    );
  }

  const toggleChecklistItem = (campo: string) => {
    setCheckedItems((prev) => {
      const nuevosSeleccionados = prev.includes(campo)
        ? prev.filter((item) => item !== campo)
        : [...prev, campo];

      // Calcular el progreso
      const totalCampos = newMante?.checklist_campos?.length || 0;
      const progreso =
        totalCampos === 0
          ? 0
          : Math.round((nuevosSeleccionados.length / totalCampos) * 100);

      // Llamar a la API para actualizar el progreso
      actualizarProgreso(newMante.id_mantenimiento, progreso);

      // Guardar el response
      // Construir el JSON de respuestas
      const respuestas: Record<string, boolean> = {};
      newMante?.checklist_campos?.forEach((campo) => {
        respuestas[campo] = nuevosSeleccionados.includes(campo);
      });

      // Guardar las respuestas completas
      saveResponse({
        mantenimientoId: newMante.id_mantenimiento,
        plantillaId: newMante.checklist_plantillas?.id_plantilla,
        tecnicoId: newMante.tecnico_id,
        respuestas,
      });

      return nuevosSeleccionados;
    });
  };

  const completeChecklist = () => {
    if (checklistData.calificacion === undefined) {
      toast.error("Debe seleccionar una calificación antes de finalizar.", {
        icon: icons.error,
      });
      return;
    }

    finalizarChecklist(
      checklistData.calificacion,
      checklistData.observaciones ?? "",
      new Date(),
      newMante.id_mantenimiento
    );
  };

  const isChecklistCompleto =
    (newMante?.checklist_campos?.length ?? 0) > 0 &&
    newMante.checklist_campos.some((campo) => checkedItems.includes(campo));

  return (
    <>
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </Button>
      </div>

      <Card className="w-full max-w-5xl mx-auto border border-gray-300 rounded-3xl bg-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-gray-900 text-center">
            Detalles del Mantenimiento
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8 mt-[-10px]">
          <div className="bg-gray-50 rounded-lg p-4 border space-y-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Building className="h-4 w-4 mr-2" />
              Información del Mantenimiento
            </h4>

            {/* Información del Equipo */}
            <div className="space-y-2">
              <p className="font-semibold text-[#01242c] mb-2">
                Equipos Asociados
              </p>
              {newMante?.mantenimiento_detalle?.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-500">
                        <th className="p-2">Nombre</th>
                        <th className="p-2">Serial</th>
                        <th className="p-2">Sede</th>
                        <th className="p-2">Sucursal</th>
                        <th className="p-2">Responsable</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newMante.mantenimiento_detalle.map((detalle, index) => {
                        const nombre =
                          detalle.equipos?.nombre_equipo ||
                          detalle.impresoras?.nombre ||
                          detalle.perifericos?.nombre ||
                          "—";

                        const serial =
                          detalle.equipos?.nro_serie ||
                          detalle.impresoras?.serial ||
                          detalle.perifericos?.serial ||
                          "—";

                        const sede =
                          detalle.equipos?.estado_ubicacion?.[0]?.sucursales
                            ?.sedes?.nombre ||
                          detalle.impresoras?.sucursales?.sedes?.nombre ||
                          detalle.perifericos?.sucursales?.sedes?.nombre ||
                          "—";

                        const sucursal =
                          detalle.equipos?.estado_ubicacion?.[0]?.sucursales
                            ?.nombre ||
                          detalle.impresoras?.sucursales?.nombre ||
                          detalle.perifericos?.sucursales?.nombre ||
                          "—";

                        const responsable =
                          detalle.equipos?.estado_ubicacion?.[0]?.usuarios
                            ?.nombre || "No aplica";

                        return (
                          <tr key={index} className="border-t">
                            <td className="p-2">{nombre}</td>
                            <td className="p-2">{serial}</td>
                            <td className="p-2">{sede}</td>
                            <td className="p-2">{sucursal}</td>
                            <td className="p-2">{responsable}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No hay equipos asignados.
                </p>
              )}
            </div>

            <Separator />

            {/* Información del Mantenimiento */}
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <CalendarIcon className="h-3 w-3" />
                  Fecha Programada
                </p>
                <p className="font-medium">
                  {formatFecha(newMante.fecha_programada)}
                </p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <User className="h-3 w-3" />
                  Técnico Responsable
                </p>
                <p className="font-medium">
                  {newMante.usuarios?.nombre || "No asignado"} –{" "}
                  <span className="text-gray-500">
                    {newMante.usuarios?.email || "Sin correo"}
                  </span>
                </p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Tiempo estimado
                </p>
                <p className="font-medium">
                  {newMante.tiempo_estimado ?? "No especificado"} hora(s)
                </p>
              </div>
              <div>
                <p className="text-gray-500 flex items-center gap-1">Estado</p>
                <p className="font-medium">{getEstadoBadge(newMante.estado)}</p>
              </div>
            </div>
          </div>

          <Separator />

          <section className="space-y-2">
            <Labels icon={ClipboardList} text="Descripción y Observaciones" />
            <div className="space-y-1  text-sm">
              <div>
                <p className="mb-5">
                  <strong>Descripción:</strong>{" "}
                  {newMante.descripcion || "No disponible"}
                </p>
              </div>
              <div>
                <p className="mb-5">
                  <strong>Recomendaciones:</strong>{" "}
                  {newMante.recomendaciones || "Ninguna"}
                </p>
              </div>
              <div>
                <p className="mb-5">
                  <strong>Observaciones adicionales:</strong>{" "}
                  {newMante.observaciones_adi || "Ninguna"}
                </p>
              </div>
            </div>
          </section>

          <Separator />

          <section className="space-y-4 rounded-lg border bg-gray-50 p-6">
            <Labels
              icon={ClipboardList}
              text={`Checklist de la plantilla - ${newMante.checklist_plantillas?.nombre}`}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {newMante?.checklist_campos?.map((campo, index) => (
                <div
                  key={index}
                  className="rounded-md border bg-white p-4 space-y-2 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{campo}</span>
                    <span className="text-xs text-gray-400">Checkbox</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={checkedItems.includes(campo)}
                      onChange={() => {
                        if (checklistCompleted) return;
                        toggleChecklistItem(campo);
                      }}
                      disabled={checklistCompleted}
                    />
                    <span
                      className={`text-sm ${
                        checkedItems.includes(campo)
                          ? "line-through text-gray-500"
                          : ""
                      }`}
                    >
                      Completado
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {isChecklistCompleto && (
              <div className="mt-6 space-y-6">
                <div className="space-y-2">
                  <Label>Observaciones</Label>
                  <Textarea
                    placeholder="Ingrese observaciones adicionales..."
                    value={checklistData.observaciones}
                    onChange={(e) =>
                      setChecklistData((prev) => ({
                        ...prev,
                        observaciones: e.target.value,
                      }))
                    }
                    className="min-h-[80px]"
                    readOnly={checklistCompleted}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Calificación del Estado del Equipo</Label>
                  {newMante.checklist_plantillas?.tipo_calificacion ===
                    "ESTRELLAS" && (
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-6 w-6 cursor-pointer transition-colors ${
                            star <= (checklistData.calificacion ?? 0)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-300 hover:text-yellow-200"
                          }${
                            !checklistCompleted
                              ? "cursor-pointer hover:text-yellow-200"
                              : "cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (checklistCompleted) return;
                            setChecklistData((prev) => ({
                              ...prev,
                              calificacion: star,
                            }));
                          }}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-600">
                        ({checklistData.calificacion ?? 0} de 5 estrellas)
                      </span>
                    </div>
                  )}
                  {/* Calificación por Escala 1-10 */}
                  {newMante.checklist_plantillas?.tipo_calificacion ===
                    "ESCALA" && (
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
                            disabled={checklistCompleted}
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
                  {newMante.checklist_plantillas?.tipo_calificacion ===
                    "CATEGORIA" && (
                    <div className="space-y-2">
                      <div className="grid grid-cols-3 gap-2">
                        {(["malo", "bueno", "excelente"] as const).map(
                          (categoria, index) => (
                            <Button
                              key={categoria}
                              type="button"
                              variant={
                                calificacionCategorica === categoria
                                  ? "default"
                                  : "outline"
                              }
                              onClick={() => {
                                if (checklistCompleted) return;
                                setCalificacionCategorica(categoria);
                                setChecklistData((prev) => ({
                                  ...prev,
                                  calificacion: index + 1,
                                }));
                              }}
                              disabled={checklistCompleted}
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

                <div className="text-right">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      completeChecklist();
                    }}
                    disabled={checklistCompleted || !isChecklistCompleto}
                  >
                    Guardar checklist
                  </Button>
                </div>
              </div>
            )}
          </section>

          {!checklistCompleted && (
            <>
              <Separator />
              <section className="space-y-4">
                <Label className="text-base font-medium">
                  Adjuntar documentos
                </Label>
                <div
                  className="border border-dashed border-gray-300 rounded-xl p-6 bg-slate-50 relative"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={async (e) => {
                    e.preventDefault();
                    const files = Array.from(e.dataTransfer.files || []);

                    const archivosFormateados = await Promise.all(
                      files.map(
                        (file) =>
                          new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              resolve({
                                id_archivo: 0,
                                mantenimiento_id: 0,
                                nombre_archivo: file.name,
                                tipo_archivo: file.type,
                                archivos: [file],
                                archivo: {
                                  content: reader.result as string, 
                                  nombre: file.name,
                                  tipo: file.type,
                                },
                                fecha_subida: new Date(),
                              });
                            };
                            reader.onerror = reject;
                            reader.readAsDataURL(file);
                          })
                      )
                    );

                    setNewMante((prev) => ({
                      ...prev,
                      archivosmantenimiento: [
                        ...(prev.archivosmantenimiento || []),
                        ...(archivosFormateados as any[]),
                      ],
                    }));
                  }}
                >
                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <Paperclip className="h-8 w-8 text-slate-400" />
                    <p className="text-sm text-slate-600">
                      Arrastra y suelta archivos aquí o
                      <label
                        htmlFor="documentos"
                        className="text-blue-600 cursor-pointer font-semibold ml-1"
                      >
                        haz clic para seleccionarlos
                      </label>
                    </p>
                    <Input
                      id="documentos"
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                      className="hidden"
                      onChange={(e) => {
                        const selectedFiles = Array.from(e.target.files || []);

                        if (selectedFiles.length > 0) {
                          const archivosFormateados = selectedFiles.map(
                            (file) => ({
                              id_archivo: 0,
                              mantenimiento_id: 0,
                              nombre_archivo: file.name,
                              tipo_archivo: file.type,
                              archivos: [file],
                              archivo: {
                                content: "",
                                nombre: file.name,
                                tipo: file.type,
                              },
                              fecha_subida: new Date(),
                            })
                          );

                          setNewMante((prev) => ({
                            ...prev,
                            archivosmantenimiento: [
                              ...(prev.archivosmantenimiento || []),
                              ...archivosFormateados,
                            ],
                          }));
                        }
                      }}
                    />
                  </div>
                </div>
                {newMante.archivosmantenimiento?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <Label className="text-sm">Archivos seleccionados</Label>

                    {newMante.archivosmantenimiento.map((file, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between border rounded-md p-3 bg-white"
                      >
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 overflow-hidden">
                            <FileText className="h-4 w-4 text-blue-500" />
                            <span className="text-sm truncate">
                              {file.archivos?.[0]?.name ?? file.nombre_archivo}
                            </span>
                          </div>
                        </div>

                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            const newFiles =
                              newMante.archivosmantenimiento.filter(
                                (_, i) => i !== index
                              );
                            setNewMante((prev) => ({
                              ...prev,
                              archivosmantenimiento: newFiles,
                            }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => {
                        const filesToUpload = newMante.archivosmantenimiento
                          ?.flatMap((item) => item.archivos)
                          .filter((f) => f instanceof File);

                        if (filesToUpload?.length) {
                          upload(newMante.id_mantenimiento, filesToUpload);
                        }
                      }}
                      className="mt-10 w-full"
                    >
                      <Upload className="w-4 h-4" />
                      Subir Archivos
                    </Button>
                  </div>
                )}
              </section>
            </>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default MantenimientoDetalle;
