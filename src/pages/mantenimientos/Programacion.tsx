
import { useState } from "react";
import { Calendar, ChevronLeft, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ProgramacionMantenimiento = () => {
  const navigate = useNavigate();
  const [tipoMantenimiento, setTipoMantenimiento] = useState<string>("todos");

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Programación de Mantenimientos</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Select value={tipoMantenimiento} onValueChange={setTipoMantenimiento}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Tipo de mantenimiento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="preventivo">Preventivo</SelectItem>
            <SelectItem value="correctivo">Correctivo</SelectItem>
          </SelectContent>
        </Select>

        <Button className="bg-[#040d50]">
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Mantenimiento
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo</TableHead>
                <TableHead className="text-[#040d50]">Fecha Programada</TableHead>
                <TableHead className="text-[#040d50]">Responsable</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Aquí irían los datos de mantenimientos programados */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramacionMantenimiento;
