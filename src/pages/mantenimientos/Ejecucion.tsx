import { ChevronLeft, Eye, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
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
import { useSedes } from "../configuracion/maestros/hooks/use-sedes";
import { useSucursales } from "../configuracion/maestros/hooks/use-sucursales";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { useGlobal } from "@/hooks/use-global";

const EjecucionMantenimiento = () => {
  const navigate = useNavigate();
  const { sedes } = useSedes();
  const { sucursales } = useSucursales();
  const { formatFecha } = useGlobal();
  const {
    mantenimientosFiltrados,
    selectedSede,
    setSelectedSede,
    selectedSucursal,
    setSelectedSucursal,
    searchTerm,
    setSearchTerm,
    getEstadoBadge,
    getProgresoBar,
  } = useMantenimiento();

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mantenimientos")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-[#040d50]">
          Ejecución de Mantenimientos
        </h1>
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
                  <SelectItem
                    key={sede.id_sede}
                    value={sede.id_sede.toString()}
                  >
                    {sede.nombre} - {sede.regional}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedSucursal}
              onValueChange={setSelectedSucursal}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filtrar por Bodega" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Bodegas</SelectItem>
                {sucursales.map((sucursale) => (
                  <SelectItem
                    key={sucursale.id_sucursal}
                    value={sucursale.id_sucursal.toString()}
                  >
                    {sucursale.nombre}
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
                <TableHead className="text-[#040d50]">Bodega</TableHead>
                <TableHead className="text-[#040d50]">Fecha Inicio</TableHead>
                <TableHead className="text-[#040d50]">Técnico</TableHead>
                <TableHead className="text-[#040d50]">Estado</TableHead>
                <TableHead className="text-[#040d50]">Progreso</TableHead>
                <TableHead className="text-right text-[#040d50]">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mantenimientosFiltrados.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-8 text-muted-foreground"
                  >
                    No hay mantenimientos que coincidan con los filtros
                    seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                [...mantenimientosFiltrados]
                .sort(
                  (a, b) =>
                    new Date(b.fecha_programada).getTime() -
                    new Date(a.fecha_programada).getTime()
                )
                .map((mantenimiento) => (
                  <TableRow key={mantenimiento.id_mantenimiento}>
                    <TableCell className="font-medium">
                      {mantenimiento.equipos?.nombre_equipo || "—"}
                    </TableCell>
                    <TableCell>{mantenimiento.tipo}</TableCell>
                    <TableCell>
                      {mantenimiento.equipos?.sucursales?.sedes?.nombre || "—"}
                    </TableCell>
                    <TableCell>
                      {mantenimiento.equipos?.sucursales?.nombre || "—"}
                    </TableCell>
                    <TableCell>
                      {formatFecha(mantenimiento.fecha_programada)}
                    </TableCell>
                    <TableCell>
                      {mantenimiento.usuarios?.nombre || "—"}
                    </TableCell>
                    <TableCell>
                      {getEstadoBadge(mantenimiento.estado)}
                    </TableCell>
                    <TableCell>{getProgresoBar(mantenimiento.progreso)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#040d50]"
                        onClick={() => navigate(`/mantenimientos/detalles/${mantenimiento.id_mantenimiento}`)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default EjecucionMantenimiento;
