import { useState } from "react";
import { ChevronLeft, Search, Check, Clock, AlertCircle, Pause, Filter } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [selectedSede, setSelectedSede] = useState<string>("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");
  const [selectedBodega, setSelectedBodega] = useState<string>("all");

  const sedes = [
    { id: "1", nombre: "Sede Principal" },
    { id: "2", nombre: "Sede Norte" },
    { id: "3", nombre: "Sede Sur" },
  ];

  const areas = [
    { id: "1", nombre: "Área Administrativa" },
    { id: "2", nombre: "Área de Producción" },
    { id: "3", nombre: "Área de TI" },
    { id: "4", nombre: "Área de Ventas" },
  ];

  const bodegas = [
    { id: "1", nombre: "Bodega Principal" },
    { id: "2", nombre: "Bodega de Equipos" },
    { id: "3", nombre: "Bodega de Repuestos" },
  ];

  const mantenimientos = [
    {
      id: 1,
      equipo: "Impresora HP LaserJet",
      tipo: "Preventivo",
      fechaInicio: "2024-03-15 09:00",
      tecnico: "Juan Pérez",
      estado: "en_progreso",
      progreso: 75,
      sede: "Sede Principal",
      area: "Área Administrativa",
      bodega: "Bodega Principal",
    },
    {
      id: 2,
      equipo: "Servidor Principal",
      tipo: "Correctivo",
      fechaInicio: "2024-03-15 10:30",
      tecnico: "María González",
      estado: "pausado",
      progreso: 45,
      sede: "Sede Norte",
      area: "Área de TI",
      bodega: "Bodega de Equipos",
    },
    {
      id: 3,
      equipo: "Router Cisco",
      tipo: "Preventivo",
      fechaInicio: "2024-03-15 11:15",
      tecnico: "Carlos Rodríguez",
      estado: "iniciado",
      progreso: 15,
      sede: "Sede Sur",
      area: "Área de TI",
      bodega: "Bodega de Equipos",
    },
    {
      id: 4,
      equipo: "Computador Dell XPS",
      tipo: "Correctivo",
      fechaInicio: "2024-03-15 13:00",
      tecnico: "Ana Martínez",
      estado: "finalizado",
      progreso: 100,
      sede: "Sede Principal",
      area: "Área de Ventas",
      bodega: "Bodega Principal",
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

  const filteredMantenimientos = mantenimientos.filter((mantenimiento) => {
    const matchesSearch =
      mantenimiento.equipo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.tecnico.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mantenimiento.tipo.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSede = selectedSede === "all" ? true : mantenimiento.sede === sedes.find(s => s.id === selectedSede)?.nombre;
    const matchesArea = selectedArea === "all" ? true : mantenimiento.area === areas.find(a => a.id === selectedArea)?.nombre;
    const matchesBodega = selectedBodega === "all" ? true : mantenimiento.bodega === bodegas.find(b => b.id === selectedBodega)?.nombre;

    return matchesSearch && matchesSede && matchesArea && matchesBodega;
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate("/mantenimientos")}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">Ejecución de Mantenimientos</h1>
      </div>

      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por equipo, técnico o tipo..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select value={selectedSede} onValueChange={setSelectedSede}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Sede" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Sedes</SelectItem>
                {sedes.map((sede) => (
                  <SelectItem key={sede.id} value={sede.id}>
                    {sede.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedArea} onValueChange={setSelectedArea}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Área" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Áreas</SelectItem>
                {areas.map((area) => (
                  <SelectItem key={area.id} value={area.id}>
                    {area.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedBodega} onValueChange={setSelectedBodega}>
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Bodega" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Bodegas</SelectItem>
                {bodegas.map((bodega) => (
                  <SelectItem key={bodega.id} value={bodega.id}>
                    {bodega.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[#040d50]">Equipo</TableHead>
                <TableHead className="text-[#040d50]">Tipo</TableHead>
                <TableHead className="text-[#040d50]">Sede</TableHead>
                <TableHead className="text-[#040d50]">Área</TableHead>
                <TableHead className="text-[#040d50]">Bodega</TableHead>
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
                  <TableCell>{mantenimiento.sede}</TableCell>
                  <TableCell>{mantenimiento.area}</TableCell>
                  <TableCell>{mantenimiento.bodega}</TableCell>
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
