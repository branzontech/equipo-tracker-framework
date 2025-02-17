
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { FileText, MapPin, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type Acta = {
  id: string;
  tipo: "prestamo" | "traslado";
  fecha: Date;
  usuario: string;
  estado: "vigente" | "finalizada";
  descripcion: string;
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <FileText className="h-5 w-5" />
            Acta {acta.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
                  <FileText className="h-4 w-4" />
                  <span>Tipo de Acta</span>
                </div>
                <p className="mt-1 font-medium capitalize">{acta.tipo}</p>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Detalles del Acta</h3>
            <div className="space-y-2">
              <div>
                <span className="text-muted-foreground">Fecha:</span>{" "}
                <span>{format(acta.fecha, "PPP")}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Estado:</span>{" "}
                <span className={`capitalize ${
                  acta.estado === "vigente" ? "text-green-600" : "text-gray-600"
                }`}>
                  {acta.estado}
                </span>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-semibold">Descripción</h3>
            <p className="text-muted-foreground">{acta.descripcion}</p>
          </div>

          {acta.tipo === "traslado" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Información de Traslado</h3>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Sede Medellín</p>
                    <p className="text-sm text-muted-foreground">
                      Bodega Principal - Piso 2
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {acta.tipo === "prestamo" && (
            <>
              <Separator />
              <div className="space-y-4">
                <h3 className="font-semibold">Detalles del Préstamo</h3>
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">
                    El equipo ha sido entregado en calidad de préstamo y debe ser
                    devuelto en las mismas condiciones en las que fue recibido.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
