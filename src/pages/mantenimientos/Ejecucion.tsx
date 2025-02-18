
import { useState } from "react";
import { ChevronLeft, Search } from "lucide-react";
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

const EjecucionMantenimiento = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Ejecución de Mantenimientos</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#040d50]" />
          <Input
            placeholder="Buscar mantenimientos en curso..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo</TableHead>
                <TableHead className="text-[#040d50]">Fecha Inicio</TableHead>
                <TableHead className="text-[#040d50]">Técnico</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Progreso</TableHead>
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Aquí irían los datos de mantenimientos en ejecución */}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EjecucionMantenimiento;
