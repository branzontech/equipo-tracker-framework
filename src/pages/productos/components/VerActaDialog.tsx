
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { FileText, MapPin, User, Calendar, Info, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Acta = {
  id: string;
  tipo: "prestamo" | "traslado";
  fecha: Date;
  usuario: string;
  estado: "vigente" | "finalizada";
  descripcion: string;
  equipos?: {
    serial: string;
    marca: string;
    activoFijo: string;
    accesorios: string;
  }[];
  firmaEntrega?: string;
  firmaRecibe?: string;
  regionalDestino?: string;
  bodegaDestino?: string;
  motivoTraslado?: string;
};

interface VerActaDialogProps {
  acta: Acta | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function VerActaDialog({ acta, open, onOpenChange }: VerActaDialogProps) {
  if (!acta) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Acta {acta.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información Principal */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Fecha</span>
                </div>
                <p className="mt-1 font-medium">{format(acta.fecha, "PPP")}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>Usuario</span>
                </div>
                <p className="mt-1 font-medium">{acta.usuario}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
                  <span>Estado</span>
                </div>
                <p className={`mt-1 font-medium ${
                  acta.estado === "vigente" ? "text-green-600" : "text-gray-600"
                }`}>
                  <span className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    {acta.estado.charAt(0).toUpperCase() + acta.estado.slice(1)}
                  </span>
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Tipo de Acta y Detalles */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              {acta.tipo === "prestamo" ? "Préstamo de Equipos" : "Traslado de Equipos"}
            </h3>

            {/* Tabla de Equipos */}
            <div className="overflow-x-auto rounded-lg border bg-white">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activo Fijo</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Accesorios</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {acta.equipos?.map((equipo, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.serial}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.marca}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{equipo.activoFijo}</td>
                      <td className="px-6 py-4 text-sm">{equipo.accesorios}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {acta.descripcion && (
            <>
              <Separator />
              <div className="space-y-2">
                <h3 className="font-semibold">Descripción</h3>
                <p className="text-muted-foreground">{acta.descripcion}</p>
              </div>
            </>
          )}

          {acta.tipo === "traslado" && acta.regionalDestino && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Información de Traslado</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Regional {acta.regionalDestino}</p>
                      <p className="text-sm text-muted-foreground">
                        {acta.bodegaDestino}
                      </p>
                    </div>
                  </div>
                  {acta.motivoTraslado && (
                    <p className="text-sm text-muted-foreground mt-2">
                      <span className="font-medium">Motivo: </span>
                      {acta.motivoTraslado}
                    </p>
                  )}
                </div>
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
