
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EquiposTableProps {
  equipos: Array<{
    serial?: string;
    activoFijo?: string;
    motivo?: string;
    descripcionEstado?: string;
  }>;
  onDeleteEquipo: (index: number) => void;
}

export function EquiposTable({ equipos, onDeleteEquipo }: EquiposTableProps) {
  // Filter to only show complete equipos
  const completeEquipos = equipos.filter(equipo => 
    equipo.serial && equipo.serial !== "" &&
    equipo.activoFijo && equipo.activoFijo !== "" &&
    equipo.motivo && equipo.motivo !== "" &&
    equipo.descripcionEstado && equipo.descripcionEstado !== ""
  );
  
  if (!completeEquipos.length) return null;
  
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Serial</TableHead>
            <TableHead>Activo Fijo</TableHead>
            <TableHead>Motivo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="w-20">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {completeEquipos.map((equipo, index) => (
            <TableRow key={index}>
              <TableCell>{equipo.serial}</TableCell>
              <TableCell>{equipo.activoFijo}</TableCell>
              <TableCell>{equipo.motivo}</TableCell>
              <TableCell className="max-w-[200px] truncate" title={equipo.descripcionEstado}>
                {equipo.descripcionEstado}
              </TableCell>
              <TableCell>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => onDeleteEquipo(index)}
                  className="h-8 w-8 text-red-500"
                >
                  <Trash className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
