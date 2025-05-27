
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { 
  FileText, 
  MapPin, 
  User, 
  Calendar, 
  Info, 
  CheckCircle, 
  Tag, 
  FileX, 
  Clock, 
  ArrowUpFromLine, 
  Banknote, 
  Truck, 
  RotateCw, 
  DollarSign,
  Building,
  AlertCircle
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type TipoActa = "prestamo" | "traslado" | "baja" | "donacion" | "venta" | "reposicion";

type Acta = {
  id: string;
  tipo: TipoActa;
  fecha: Date;
  usuario: string;
  estado: "vigente" | "finalizada" | "en_proceso" | "cancelada" | "pendiente_devolucion";
  descripcion: string;
  equipos?: {
    serial: string;
    marca: string;
    activoFijo: string;
    accesorios: string;
    descripcion?: string;
  }[];
  firmaEntrega?: string;
  firmaRecibe?: string;
  regionalDestino?: string;
  bodegaDestino?: string;
  motivoTraslado?: string;
  fechaDevolucion?: Date;
  observaciones?: string;
  motivoBaja?: string;
  autorizadoPor?: string;
  valorVenta?: number;
  empresaCompradora?: string;
  tipoReposicion?: "garantia" | "seguro" | "otro";
  anexos?: string[];
};

interface VerActaDialogProps {
  acta: Acta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerActaDialog({ acta, open, onOpenChange }: VerActaDialogProps) {
  if (!acta) return null;

  const getTipoIcon = (tipo: TipoActa) => {
    switch (tipo) {
      case "prestamo":
        return <Banknote className="h-5 w-5 text-blue-500" />;
      case "traslado":
        return <Truck className="h-5 w-5 text-green-500" />;
      case "baja":
        return <FileX className="h-5 w-5 text-red-500" />;
      case "donacion":
        return <ArrowUpFromLine className="h-5 w-5 text-purple-500" />;
      case "venta":
        return <Tag className="h-5 w-5 text-orange-500" />;
      case "reposicion":
        return <RotateCw className="h-5 w-5 text-teal-500" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  const getTipoLabel = (tipo: TipoActa) => {
    const labels: Record<TipoActa, string> = {
      "prestamo": "Préstamo",
      "traslado": "Traslado",
      "baja": "Baja",
      "donacion": "Donación",
      "venta": "Venta",
      "reposicion": "Reposición"
    };
    return labels[tipo] || tipo;
  };

  const getEstadoLabel = (estado: Acta["estado"]) => {
    const labels: Record<Acta["estado"], string> = {
      "vigente": "Vigente",
      "finalizada": "Finalizada",
      "en_proceso": "En proceso",
      "cancelada": "Cancelada",
      "pendiente_devolucion": "Pendiente de devolución"
    };
    return labels[estado] || estado;
  };

  const getEstadoBadge = (estado: Acta["estado"]) => {
    switch (estado) {
      case "vigente":
        return "bg-green-100 text-green-800";
      case "finalizada":
        return "bg-gray-100 text-gray-800";
      case "en_proceso":
        return "bg-blue-100 text-blue-800";
      case "cancelada":
        return "bg-red-100 text-red-800";
      case "pendiente_devolucion":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', { 
      style: 'currency', 
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            {getTipoIcon(acta.tipo)}
            Acta {acta.id}
          </DialogTitle>
          <DialogDescription>
            {getTipoLabel(acta.tipo)} de equipos - {format(acta.fecha, "PPP")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal y Estado */}
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Creada: {format(acta.fecha, "PPP")}</span>
              </div>
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{acta.usuario}</span>
              </div>
            </div>
            <Badge className={`capitalize text-sm px-3 py-1 ${getEstadoBadge(acta.estado)}`}>
              <span className="flex items-center gap-2">
                {acta.estado === "vigente" && <CheckCircle className="h-3.5 w-3.5" />}
                {acta.estado === "finalizada" && <CheckCircle className="h-3.5 w-3.5" />}
                {acta.estado === "en_proceso" && <RotateCw className="h-3.5 w-3.5" />}
                {acta.estado === "cancelada" && <FileX className="h-3.5 w-3.5" />}
                {acta.estado === "pendiente_devolucion" && <AlertCircle className="h-3.5 w-3.5" />}
                {getEstadoLabel(acta.estado)}
              </span>
            </Badge>
          </div>

          {/* Descripción */}
          {acta.descripcion && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{acta.descripcion}</p>
            </div>
          )}

          {/* Información específica según tipo */}
          {acta.tipo === "prestamo" && acta.fechaDevolucion && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <Clock className="h-4 w-4 text-blue-500" />
                  Información de Préstamo
                </h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Fecha de devolución programada:</span>
                    <p className="font-medium">{format(acta.fechaDevolucion, "PPP")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "traslado" && acta.regionalDestino && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <MapPin className="h-4 w-4 text-green-500" />
                  Información de Traslado
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">Regional destino:</span>
                    <p className="font-medium">{acta.regionalDestino}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Bodega destino:</span>
                    <p className="font-medium">{acta.bodegaDestino}</p>
                  </div>
                  {acta.motivoTraslado && (
                    <div className="col-span-2">
                      <span className="text-sm text-gray-500">Motivo de traslado:</span>
                      <p>{acta.motivoTraslado}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "baja" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <FileX className="h-4 w-4 text-red-500" />
                  Información de Baja de Equipo
                </h3>
                <div className="space-y-3">
                  {acta.motivoBaja && (
                    <div>
                      <span className="text-sm text-gray-500">Motivo de baja:</span>
                      <p className="font-medium">{acta.motivoBaja}</p>
                    </div>
                  )}
                  {acta.autorizadoPor && (
                    <div>
                      <span className="text-sm text-gray-500">Autorizado por:</span>
                      <p className="font-medium">{acta.autorizadoPor}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "venta" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <DollarSign className="h-4 w-4 text-orange-500" />
                  Información de Venta
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {acta.valorVenta && (
                    <div>
                      <span className="text-sm text-gray-500">Valor de venta:</span>
                      <p className="font-medium text-lg">{formatCurrency(acta.valorVenta)}</p>
                    </div>
                  )}
                  {acta.empresaCompradora && (
                    <div>
                      <span className="text-sm text-gray-500">Empresa compradora:</span>
                      <p className="font-medium">{acta.empresaCompradora}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {acta.tipo === "donacion" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <ArrowUpFromLine className="h-4 w-4 text-purple-500" />
                  Información de Donación
                </h3>
                {acta.firmaRecibe && (
                  <div>
                    <span className="text-sm text-gray-500">Entidad receptora:</span>
                    <p className="font-medium">{acta.firmaRecibe}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {acta.tipo === "reposicion" && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold flex items-center gap-2 mb-3">
                  <RotateCw className="h-4 w-4 text-teal-500" />
                  Información de Reposición
                </h3>
                <div className="space-y-3">
                  {acta.tipoReposicion && (
                    <div>
                      <span className="text-sm text-gray-500">Tipo de reposición:</span>
                      <p className="font-medium capitalize">
                        {acta.tipoReposicion === "garantia" ? "Garantía" : 
                         acta.tipoReposicion === "seguro" ? "Seguro" : 
                         acta.tipoReposicion}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Tabla de Equipos */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Info className="h-4 w-4" />
              Equipos incluidos
            </h3>

            {/* Tabla de Equipos */}
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descripción</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo Fijo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accesorios</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acta.equipos?.map((equipo, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.serial}</td>
                      <td className="px-6 py-4 text-sm">{equipo.descripcion || "-"}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.marca}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.activoFijo}</td>
                      <td className="px-6 py-4 text-sm">{equipo.accesorios}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Observaciones */}
          {acta.observaciones && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Observaciones</h3>
                <p className="text-muted-foreground">{acta.observaciones}</p>
              </div>
            </>
          )}

          {/* Firmas */}
          {(acta.firmaEntrega || acta.firmaRecibe) && (
            <>
              <Separator />
              <div className="grid grid-cols-2 gap-8 pt-4">
                {acta.firmaEntrega && (
                  <div className="text-center">
                    <div className="border-t border-gray-300 pt-2">
                      <p className="font-medium">{acta.firmaEntrega}</p>
                      <p className="text-sm text-muted-foreground">Entrega</p>
                    </div>
                  </div>
                )}
                {acta.firmaRecibe && (
                  <div className="text-center">
                    <div className="border-t border-gray-300 pt-2">
                      <p className="font-medium">{acta.firmaRecibe}</p>
                      <p className="text-sm text-muted-foreground">Recibe</p>
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
