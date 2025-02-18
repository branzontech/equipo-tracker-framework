
import { useState } from "react";
import { ChevronLeft, Search, Check, Clock, AlertCircle, Pause } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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

  // Datos de ejemplo para la tabla
  const mantenimientos = [
    {
      id: 1,
      equipo: "Impresora HP LaserJet",
      tipo: "Preventivo",
      fechaInicio: "2024-03-15 09:00",
      tecnico: "Juan Pérez",
      estado: "en_progreso",
      progreso: 75,
    },
    {
      id: 2,
      equipo: "Servidor Principal",
      tipo: "Correctivo",
      fechaInicio: "2024-03-15 10:30",
      tecnico: "María González",
      estado: "pausado",
      progreso: 45,
    },
    {
      id: 3,
      equipo: "Router Cisco",
      tipo: "Preventivo",
      fechaInicio: "2024-03-15 11:15",
      tecnico: "Carlos Rodríguez",
      estado: "iniciado",
      progreso: 15,
    },
    {
      id: 4,
      equipo: "Computador Dell XPS",
      tipo: "Correctivo",
      fechaInicio: "2024-03-15 13:00",
      tecnico: "Ana Martínez",
      estado: "finalizado",
      progreso: 100,
    },
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "en_progreso":
        return (
          <Badge variant="outline" className="bg-blue-500 text-white flex items-center gap-1">
            <Clock className="h-3 w-3" />
            En Progreso
          </Badge>
        );
      case "pausado":
        return (
          <Badge variant="outline" className="bg-yellow-500 text-white flex items-center gap-1">
            <Pause className="h-3 w-3" />
            Pausado
          </Badge>
        );
      case "finalizado":
        return (
          <Badge variant="outline" className="bg-green-500 text-white flex items-center gap-1">
            <Check className="h-3 w-3" />
            Finalizado
          </Badge>
        );
      case "iniciado":
        return (
          <Badge variant="outline" className="bg-purple-500 text-white flex items-center gap-1">
            <AlertCircle className="h-3 w-3" />
            Iniciado
          </Badge>
        );
      default:
        return null;
    }
  };

  const getProgresoBar = (progreso: number) => {
    const color = progreso === 100 ? "bg-green-500" : "bg-blue-500";
    return (
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full ${color}`}
          style={{ width: `${progreso}%` }}
        ></div>
      </div>
    );
  };

  const filteredMantenimientos = mantenimientos.filter(
    (mantenimiento) =>
      mantenimiento.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            placeholder="Buscar por equipo, técnico o tipo..."
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
                <TableHead className="text-right text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMantenimientos.map((mantenimiento) => (
                <TableRow key={mantenimiento.id}>
                  <TableCell className="font-medium">{mantenimiento.equipo}</TableCell>
                  <TableCell>{mantenimiento.tipo}</TableCell>
                  <TableCell>{mantenimiento.fechaInicio}</TableCell>
                  <TableCell>{mantenimiento.tecnico}</TableCell>
                  <TableCell>{getEstadoBadge(mantenimiento.estado)}</TableCell>
                  <TableCell className="w-32">{getProgresoBar(mantenimiento.progreso)}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="text-[#040d50]">
                      Ver Detalles
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EjecucionMantenimiento;
