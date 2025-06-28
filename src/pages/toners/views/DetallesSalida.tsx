/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Printer, MapPin, Calendar, Info, FileText } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface VerSalidaTonerDialogProps {
  salida: any | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formatFecha: (fecha: string | Date) => string;
}

export function VerSalidaTonerDialog({
  salida,
  open,
  onOpenChange,
  formatFecha,
}: VerSalidaTonerDialogProps) {
  if (!salida) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl border border-gray-200 text-[15px]">
  <DialogHeader>
    <DialogTitle className="flex items-center gap-2 text-[20px] font-semibold">
      <Info className="h-5 w-5 text-blue-500" />
      Detalle de salida de tóner
    </DialogTitle>
    <DialogDescription className="text-[14px] text-muted-foreground mt-1">
      Registro generado el {formatFecha(salida.fecha)}
    </DialogDescription>
    <div className="flex flex-wrap gap-3 mt-5">
      <Badge className="bg-blue-50 text-blue-700 border border-blue-200 text-[14px] px-3 py-1.5">
        Tóner:{" "}
        <span className="ml-1 font-medium">
          {salida.toner?.modelo || "Desconocido"}
        </span>
      </Badge>
      <Badge variant="secondary" className="text-[14px] px-3 py-1.5">
        Cantidad: <span className="ml-1 font-medium">{salida.cantidad}</span>
      </Badge>
    </div>
  </DialogHeader>

  <div className="space-y-6 text-[15px]">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      {[
        {
          icon: <Printer className="h-5 w-5 text-muted-foreground" />,
          label: "Impresora origen",
          value:
            salida.impresoras_salidatoners_impresora_origen_idToimpresoras
              ?.nombre || "-",
        },
        {
          icon: <Printer className="h-5 w-5 text-muted-foreground" />,
          label: "Impresora destino",
          value: salida.impresoras?.nombre || "-",
        },
        {
          icon: <User className="h-5 w-5 text-muted-foreground" />,
          label: "Usuario que retira",
          value:
            salida.usuarios_salidatoners_usuario_retiro_idTousuarios?.nombre ||
            "-",
        },
        {
          icon: <User className="h-5 w-5 text-muted-foreground" />,
          label: "Usuario que entrega",
          value: salida.usuarios?.nombre || "-",
        },
        {
          icon: <MapPin className="h-5 w-5 text-muted-foreground" />,
          label: "Sucursal destino",
          value: salida.sucursales?.nombre || "-",
        },
        {
          icon: <Calendar className="h-5 w-5 text-muted-foreground" />,
          label: "Fecha",
          value: formatFecha(salida.fecha),
        },
      ].map(({ icon, label, value }, idx) => (
        <div key={idx} className="flex items-start gap-2">
          {icon}
          <div>
            <p className="text-muted-foreground font-medium">{label}:</p>
            <p className="font-semibold text-gray-900">{value}</p>
          </div>
        </div>
      ))}
    </div>

    {salida.observaciones && (
      <Card>
        <CardContent className="pt-4 bg-gray-50 rounded-md border text-[15px] leading-relaxed">
          <h3 className="font-semibold mb-2 flex items-center gap-2 text-[16px]">
            <FileText className="h-5 w-5 text-muted-foreground" />
            Observaciones
          </h3>
          <p className="text-gray-700 whitespace-pre-wrap">
            {salida.observaciones}
          </p>
        </CardContent>
      </Card>
    )}

    <Separator />
  </div>
</DialogContent>

    </Dialog>
  );
}
