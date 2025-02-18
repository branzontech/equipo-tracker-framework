
import { useState } from "react";
import { ChevronLeft, Search, Filter, Download } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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

const AuditoriaMantenimiento = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterPeriod, setFilterPeriod] = useState("todo");

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Auditoría de Mantenimientos</h1>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#040d50]" />
          <Input
            placeholder="Buscar registros..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={filterPeriod} onValueChange={setFilterPeriod}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="hoy">Hoy</SelectItem>
            <SelectItem value="semana">Última semana</SelectItem>
            <SelectItem value="mes">Último mes</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">Fecha</TableHead>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo</TableHead>
                <TableHead className="text-[#040d50]">Responsable</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Cumplimiento</TableHead>
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Aquí irían los registros de auditoría */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuditoriaMantenimiento;
