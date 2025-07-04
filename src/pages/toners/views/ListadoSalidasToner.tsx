import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToners } from "../hooks/use-toners";
import { formatFecha } from "@/hooks/use-global";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { VerSalidaTonerDialog } from "./DetallesSalida";

export const ListadoSalidasToner = () => {
  const {
    salidaToner,
    detalleSeleccionado,
    handleVerDetalle,
    setDetalleSeleccionado,
  } = useToners();

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Listado de Salidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tóner</TableHead>
                  <TableHead>Impresora Origen</TableHead>
                  <TableHead>Impresora Destino</TableHead>
                  <TableHead>Ubicación Destino</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {salidaToner.map((salida) => (
                  <TableRow key={salida.id_movimiento}>
                    <TableCell>{salida.toner?.modelo}</TableCell>
                    <TableCell>
                      {
                        salida
                          .impresoras_salidatoners_impresora_origen_idToimpresoras
                          ?.nombre
                      }
                    </TableCell>
                    <TableCell>{salida.impresoras?.nombre}</TableCell>
                    <TableCell>{salida.sucursales?.nombre}</TableCell>
                    <TableCell>{salida.cantidad}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="hover:bg-slate-100"
                        onClick={() => handleVerDetalle(salida)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {salidaToner.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={9}
                      className="text-center text-sm py-4 text-muted-foreground"
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <VerSalidaTonerDialog
        salida={detalleSeleccionado}
        open={!!detalleSeleccionado}
        onOpenChange={() => setDetalleSeleccionado(null)}
        formatFecha={formatFecha}
      />
    </>
  );
};
