import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  FileText,
  MapPin,
  User,
  Calendar,
  Info,
  CheckCircle,
  FileX,
  Clock,
  ArrowUpFromLine,
  RotateCw,
  AlertCircle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Acta } from "../interfaces/acta";
import { useActa } from "../hooks/use-acta";
import { useGlobal } from "@/hooks/use-global";

interface VerActaDialogProps {
  acta: Acta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerActaDialog({
  acta,
  open,
  onOpenChange,
}: VerActaDialogProps) {
  const {
    getActaData,
    getTipoIcon,
    getEstadoFromActa,
    getEstadoLabel,
    getEstadoBadge,
    getTipoLabel,
    getEquiposFromActa,
    getFirmas,
  } = useActa();

  const { formatFecha } = useGlobal();

  if (!acta) return null;

  const { usuario, descripcion } = getActaData(acta);
  const estado = getEstadoFromActa(acta);
  const equipos = getEquiposFromActa(acta);
  const { firmaEntrega, nombreEntrega, firmaRecibe, nombreRecibe } =
    getFirmas(acta);

  const mostrarColumnaPerifericos =
    acta.tipo !== "Baja" &&
    equipos.some((e) => e.accesorios && e.accesorios !== "-");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTipoIcon(acta.tipo)}
            Acta {acta.id_acta.toString().padStart(3, "0")}
          </DialogTitle>
          <DialogDescription>
            {getTipoLabel(acta.tipo)} de equipos -{" "}
            {formatFecha(
              typeof acta.fecha === "string"
                ? acta.fecha
                : acta.fecha.toISOString()
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal y Estado */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>
                  Creada:{" "}
                  {formatFecha(
                    typeof acta.fecha === "string"
                      ? acta.fecha
                      : acta.fecha.toISOString()
                  )}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{usuario}</span>
              </div>
            </div>
            <Badge
              className={`capitalize text-sm px-3 py-1 ${getEstadoBadge(
                estado
              )}`}
            >
              <span className="flex items-center gap-2">
                {estado === "Pendiente" && <Clock className="h-3.5 w-3.5" />}
                {estado === "Finalizado" && (
                  <CheckCircle className="h-3.5 w-3.5" />
                )}
                {estado === "En proceso" && (
                  <RotateCw className="h-3.5 w-3.5" />
                )}
                {estado === "Desconocido" && (
                  <AlertCircle className="h-3.5 w-3.5" />
                )}
                {estado === "Cancelada" && <XCircle className="h-3.5 w-3.5" />}
                {estado === "Satisfactoria" && (
                  <CheckCircle2 className="h-3.5 w-3.5" />
                )}
                {getEstadoLabel(estado)}
              </span>
            </Badge>
          </div>

          {/* Descripción */}
          {descripcion && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{descripcion}</p>
            </div>
          )}

          {/* Información específica según tipo */}
          {acta.tipo === "Prestamo" && acta.prestamos[0].fecha_retorno && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Información de Préstamo
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">
                      Fecha de devolución programada:
                    </span>
                    <p className="font-medium">
                      {formatFecha(
                        typeof acta.prestamos[0].fecha_retorno === "string"
                          ? acta.prestamos[0].fecha_retorno
                          : acta.prestamos[0].fecha_retorno.toISOString()
                      )}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "Traslado" && acta.traslados[0].sucursales && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-500" />
                  Información de Traslado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Regional:</span>
                    <p className="font-medium">
                      {acta.traslados[0].sucursales.sedes?.nombre}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">
                      Sucursal destino:
                    </span>
                    <p className="font-medium">
                      {acta.traslados[0].sucursales.nombre}
                    </p>
                  </div>
                  {acta.traslados[0].motivo && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-500">
                        Motivo de traslado:
                      </span>
                      <p>{acta.traslados[0].motivo}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "Baja" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <FileX className="h-4 w-4 text-red-500" />
                  Información de Baja de Activos
                </h3>

                <div className="space-y-4">
                  {acta.bajas[0]?.bajas_equipos.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Motivos de baja (Equipos):
                      </span>
                      {acta.bajas[0].bajas_equipos.map((item, i) => (
                        <p key={`equipo-${i}`} className="font-medium">
                          {item.motivos?.trim() || "Sin motivo"}
                        </p>
                      ))}
                    </div>
                  )}

                  {acta.bajas[0]?.bajas_perifericos_directos.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Motivos de baja (Periféricos):
                      </span>
                      {acta.bajas[0].bajas_perifericos_directos.map(
                        (item, i) => (
                          <p key={`periferico-${i}`} className="font-medium">
                            {item.motivos?.trim() || "Sin motivo"}
                          </p>
                        )
                      )}
                    </div>
                  )}

                  {acta.bajas[0]?.bajas_impresoras.length > 0 && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Motivos de baja (Impresoras):
                      </span>
                      {acta.bajas[0].bajas_impresoras.map((item, i) => (
                        <p key={`impresora-${i}`} className="font-medium">
                          {item.motivos?.trim() || "Sin motivo"}
                        </p>
                      ))}
                    </div>
                  )}

                  {acta.bajas[0]
                    ?.usuarios_bajas_responsable_autorizacion_idTousuarios
                    ?.nombre && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Autorizado por:
                      </span>
                      <p className="font-medium">
                        {
                          acta.bajas[0]
                            .usuarios_bajas_responsable_autorizacion_idTousuarios
                            .nombre
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "Devolucion" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ArrowUpFromLine className="h-4 w-4 text-yellow-500" />
                  Información de Devolución
                </h3>
                <div className="space-y-3">
                  {acta.devoluciones[0].motivo && (
                    <div>
                      <span className="text-sm text-gray-500">
                        Motivo de devolución:
                      </span>
                      <p className="font-medium">
                        {acta.devoluciones[0].motivo}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabla de Equipos */}
          <div className="overflow-x-auto rounded-lg border bg-white">
            <table className="min-w-full divide-y divide-gray-200">
              <tbody className="bg-white divide-y divide-gray-200">
                {equipos.length > 0 ? (
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                      <Info className="h-4 w-4" />
                      {acta.tipo === "Devolucion"
                        ? "Equipos devueltos"
                        : "Equipos incluidos"}
                    </h3>

                    <div className="overflow-x-auto rounded-lg border bg-white">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Serial
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Nombre
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Marca
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tipo de Activo
                            </th>
                            {mostrarColumnaPerifericos && (
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Periféricos
                              </th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {equipos.map((equipo, index) => (
                            <tr key={index}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {equipo.serial}
                              </td>
                              <td className="px-6 py-4 text-sm">
                                {equipo.nombre}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {equipo.marca}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                {equipo.esPerifericoDirecto
                                  ? equipo.tipo
                                  : equipo.activoFijo}
                              </td>
                              {mostrarColumnaPerifericos &&
                                !equipo.esPerifericoDirecto && (
                                  <td>
                                    {equipo.accesorios &&
                                    equipo.accesorios !== "-"
                                      ? equipo.accesorios
                                      : ""}
                                  </td>
                                )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-10 border rounded-md">
                    <FileText className="h-12 w-12 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-lg font-medium">
                      No se encontraron equipos
                    </h3>
                    <p className="text-gray-500 mt-1">
                      Este prestamo no tiene equipos asociados
                    </p>
                  </div>
                )}
              </tbody>
            </table>
          </div>

          {/* Firmas */}
          {(firmaEntrega || firmaRecibe) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-8 pt-4">
                {firmaEntrega && (
                  <div className="text-center">
                    <img
                      src={firmaEntrega}
                      alt="Firma Entrega"
                      className="mx-auto h-24"
                    />
                    <div className="border-t border-gray-300 pt-2">
                      <p className="font-medium">{nombreEntrega}</p>
                      <p className="text-sm text-muted-foreground">
                        {acta.tipo === "Baja" ? "Autoriza" : "Entrega"}
                      </p>
                    </div>
                  </div>
                )}
                {firmaRecibe && (
                  <div className="text-center">
                    <img
                      src={firmaRecibe}
                      alt="Firma Recibe"
                      className="mx-auto h-24"
                    />
                    <div className="border-t border-gray-300 pt-2">
                      <p className="font-medium">{nombreRecibe}</p>
                      <p className="text-sm text-muted-foreground">
                        {acta.tipo === "Baja" ? "Solicita" : "Recibe"}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
