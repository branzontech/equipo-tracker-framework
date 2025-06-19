/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import {
  Calendar,
  User,
  ClipboardList,
  Upload,
  Loader,
  Activity,
  MapPin,
  ArrowLeft,
  Paperclip,
  FileText,
  X,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useGlobal } from "@/hooks/use-global";

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
    update,
    estadosLegibles,
    upload,
  } = useMantenimiento();
  const { formatFecha } = useGlobal();
  const navigate = useNavigate();
  const [newEstado, setNewEstado] = useState("");

  useEffect(() => {
    getInfoById(id);
  }, []);

  if (!newMante?.id_mantenimiento) {
    return (
      <div className="w-full text-center py-20 text-gray-500">
        <Loader className="w-5 h-5 animate-spin inline-block mr-2" />
        Cargando mantenimiento...
      </div>
    );
  }

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
            INFORMACION DEL MANTENIMIENTO
          </CardTitle>
        </CardHeader>

        <CardContent className="p-8 space-y-8 mt-[-10px]">
          {newMante.equipos && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="pb-1">
                    <CardTitle className="text-sm font-medium">
                      Detalles del mantenimiento
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-semibold ">Tipo:</span>
                      <Badge className="bg-blue-600 text-white">
                        {newMante.tipo.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm font-semibold text-gray-700">
                        Prioridad:
                      </span>
                      <Badge className="bg-yellow-500 text-white">
                        {newMante.prioridad.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-semibold text-gray-700">
                        Estado:
                      </span>
                      <Badge className="bg-purple-600 text-white">
                        {estadosLegibles[newMante.estado] || "Desconocido"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Equipo asociado
                    </CardTitle>
                    <Activity className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">
                      {newMante.equipos?.nombre_equipo}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {newMante.equipos?.nro_serie} - {newMante.equipos?.modelo}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {/* Descripción y observaciones */}
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

          {/* Tiempo y responsable */}
          <section className="grid md:grid-cols-2 gap-6 text-sm ">
            <div>
              <Labels icon={Calendar} text="Tiempo estimado" />
              <p>{newMante.tiempo_estimado ?? "No especificado"} horas</p>
            </div>
            <div>
              <Labels icon={User} text="Técnico encargado" />
              <p>
                {newMante.usuarios?.nombre} –{" "}
                <span className="text-gray-500">
                  {newMante.usuarios?.email}
                </span>
              </p>
            </div>
          </section>

          <Separator />

          {/* Info ubicación + fechas */}
          <section className="space-y-4 text-sm ">
            <Labels icon={MapPin} text="Ubicación del equipo y Fechas" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card de ubicación */}
              <Card className="shadow-sm">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm">
                    Ubicación actual del equipo
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="font-semibold">Sucursal: </span>
                    {newMante.equipos?.sucursales?.nombre ?? "No disponible"}
                  </p>
                  <p>
                    <span className="font-semibold">Sede: </span>
                    {newMante.equipos?.sucursales?.sedes?.nombre ??
                      "No disponible"}
                  </p>
                  <p>
                    <span className="font-semibold">Encargado(s): </span>
                    {newMante.equipos?.sucursales?.sedes?.usuarios?.length > 0
                      ? newMante.equipos?.sucursales?.sedes?.usuarios
                          .map((u) => u.nombre)
                          .join(", ")
                      : "Sin responsables asignados"}
                  </p>
                </CardContent>
              </Card>

              {/* Card de fechas */}
              <Card className="shadow-sm">
                <CardHeader className="pb-1">
                  <CardTitle className="text-sm">
                    Fechas del mantenimiento
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p>
                    <span className="font-semibold">Programada:</span>{" "}
                    {formatFecha(newMante.fecha_programada)}
                  </p>
                  <p>
                    <span className="font-semibold">Finalización:</span>{" "}
                    {newMante.fecha_realizada
                      ? formatFecha(newMante.fecha_realizada)
                      : "Pendiente"}
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <Separator />

          {/* Acciones */}
          <div className="flex flex-wrap justify-end gap-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Loader className="w-4 h-4" />
                  Actualizar Estado
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Actualizar Estado</DialogTitle>
                  <DialogDescription>
                    Selecciona un nuevo estado para este mantenimiento.
                  </DialogDescription>
                </DialogHeader>

                <Select
                  value={newEstado}
                  onValueChange={(value) => setNewEstado(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="en_proceso">En proceso</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex justify-end mt-4">
                  <Button
                    disabled={!newEstado}
                    onClick={() => {
                      setNewMante({ ...newMante, estado: newEstado });
                      update(newMante.id_mantenimiento, newEstado);
                    }}
                  >
                    Guardar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            {/* <Button variant="outline" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Adjuntar Documentos
            </Button> */}
          </div>
          <section className="space-y-4">
            <Label className="text-base font-medium">Adjuntar documentos</Label>
            <div className="border border-dashed border-gray-300 rounded-xl p-6 bg-slate-50 relative">
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
                    const files = Array.from(e.target.files || []).map((file) => ({
                      ...file,
                      nombre_archivo: file.name,
                      tipo_archivo: file.type,
                    }));
                    if (files.length > 0) {
                      setNewMante((prev) => ({
                        ...prev,
                        archivosmantenimiento: files,
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
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <span className="text-sm truncate">
                        {file.nombre_archivo}
                      </span>
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
                  onClick={() =>
                    upload(
                      newMante.id_mantenimiento,
                      newMante.archivosmantenimiento
                    )
                  }
                  className="mt-10 w-full"
                >
                  <Upload className="w-4 h-4" />
                  Subir Archivos
                </Button>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </>
  );
};

export default MantenimientoDetalle;
