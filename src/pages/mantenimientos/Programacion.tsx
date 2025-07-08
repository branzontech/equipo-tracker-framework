/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Calendar,
  ChevronLeft,
  Filter,
  Search,
  GripVertical,
  X,
  Search as SearchIcon,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import { FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "sonner";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useMantenimiento } from "./hooks/use-mantenimiento";
import { useGlobal } from "@/hooks/use-global";
import { Label } from "@/components/ui/label";

const ProgramacionMantenimiento = () => {
  const {
    mantenimientosFiltrados,
    handleColumnDragStart,
    handleColumnDragOver,
    handleColumnDragEnter,
    handleColumnDragLeave,
    handleColumnDrop,
    handleColumnDragEnd,
    mainTableColumns,
    resetFilters,
    searchQuery,
    setSearchQuery,
    isSearching,
    showAdvancedFilters,
    setShowAdvancedFilters,
    filtroResponsable,
    setFiltroResponsable,
    filtroEstado,
    setFiltroEstado,
    filtroFechaDesde,
    setFiltroFechaDesde,
    filtroFechaHasta,
    setFiltroFechaHasta,
    tipoMantenimiento,
    setTipoMantenimiento,
    uniqueResponsables,
    uniqueEstados,
  } = useMantenimiento();
  const navigate = useNavigate();
  const { formatFecha } = useGlobal();

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/mantenimientos")}
          className="mb-2 sm:mb-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-xl sm:text-2xl font-bold text-[#01242c]">
          Programación de Mantenimientos
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 p-4">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar mantenimientos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            <Select
              value={tipoMantenimiento}
              onValueChange={setTipoMantenimiento}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Tipo de mantenimiento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="preventivo">Preventivo</SelectItem>
                <SelectItem value="correctivo">Correctivo</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              size="default"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
              className="w-full sm:w-auto"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtros Avanzados
            </Button>
          </div>

          <Collapsible
            open={showAdvancedFilters}
            onOpenChange={setShowAdvancedFilters}
          >
            <CollapsibleContent className="pt-3 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <Label>Responsable</Label>
                  <Select
                    value={filtroResponsable || ""}
                    onValueChange={setFiltroResponsable}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un responsable" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>{" "}
                      {uniqueResponsables.map((responsable) => (
                        <SelectItem key={responsable} value={responsable}>
                          {responsable}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Estado</Label>
                  <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filtrar por estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todos</SelectItem>{" "}
                      {uniqueEstados.map((estado) => (
                        <SelectItem key={estado} value={estado}>
                          {estado}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Fecha desde</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtroFechaDesde
                          ? format(filtroFechaDesde, "PP", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtroFechaDesde}
                        onSelect={setFiltroFechaDesde}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Fecha hasta</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {filtroFechaHasta
                          ? format(filtroFechaHasta, "PP", { locale: es })
                          : "Seleccionar fecha"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <CalendarComponent
                        mode="single"
                        selected={filtroFechaHasta}
                        onSelect={setFiltroFechaHasta}
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="flex items-center"
                >
                  <X className="mr-2 h-4 w-4" />
                  Limpiar Filtros
                </Button>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {isSearching && (
            <div className="flex items-center pt-2">
              <div className="text-sm text-gray-500">
                {mantenimientosFiltrados.length} resultados encontrados
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="ml-auto text-xs"
              >
                <X className="h-3 w-3 mr-1" />
                Limpiar
              </Button>
            </div>
          )}
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {mainTableColumns
                    .sort((a, b) => a.order - b.order)
                    .filter((col) => col.isVisible)
                    .map((column) => (
                      <TableHead
                        key={column.id}
                        className={column.className}
                        draggable={
                          column.id !== "acciones" && column.id !== "grip"
                        }
                        columnId={column.id}
                        onDragStart={(e) => handleColumnDragStart(e, column.id)}
                        onDragOver={handleColumnDragOver}
                        onDragEnter={(e) => handleColumnDragEnter(e, column.id)}
                        onDragLeave={handleColumnDragLeave}
                        onDrop={(e) => handleColumnDrop(e, column.id, true)}
                        onDragEnd={handleColumnDragEnd}
                      >
                        {column.id === "grip" ? (
                          <div></div>
                        ) : (
                          <div className="flex items-center gap-2 text-[#01242c]">
                            {column.id !== "acciones" &&
                              column.id !== "grip" && (
                                <GripVertical className="h-4 w-4 text-muted-foreground" />
                              )}
                            {column.label}
                          </div>
                        )}
                      </TableHead>
                    ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {mantenimientosFiltrados.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={
                        mainTableColumns.filter((col) => col.isVisible).length
                      }
                      className="text-center py-8 text-muted-foreground"
                    >
                      No hay mantenimientos programados que coincidan con los
                      criterios de búsqueda
                    </TableCell>
                  </TableRow>
                ) : (
                  [...mantenimientosFiltrados]
                    .sort(
                      (a, b) =>
                        new Date(b.fecha_programada).getTime() -
                        new Date(a.fecha_programada).getTime()
                    )
                    .map((mantenimiento) => {
                      return (
                        <TableRow key={mantenimiento.id_mantenimiento}>
                          {mainTableColumns
                            .sort((a, b) => a.order - b.order)
                            .filter((col) => col.isVisible)
                            .map((column) => {
                              const key = `${mantenimiento.id_mantenimiento}-${column.id}`;

                              if (column.id === "grip") {
                                return (
                                  <TableCell
                                    key={key}
                                    className={column.className}
                                  >
                                    <GripVertical className="h-4 w-4 text-gray-400" />
                                  </TableCell>
                                );
                              }

                              if (column.id === "equipo_id") {
                                const nombresActivos =
                                  mantenimiento.mantenimiento_detalle
                                    ?.map((detalle) => {
                                      if (detalle.equipos)
                                        return detalle.equipos.nombre_equipo;
                                      if (detalle.impresora)
                                        return detalle.impresora.nombre;
                                      if (detalle.perifericos)
                                        return detalle.perifericos.nombre;
                                      return null;
                                    })
                                    .filter(Boolean)
                                    .join(", ") || "—";

                                return (
                                  <TableCell key={key} className="font-medium">
                                    {nombresActivos}
                                  </TableCell>
                                );
                              }

                              if (column.id === "estado") {
                                return (
                                  <TableCell
                                    key={key}
                                    className={column.className}
                                  >
                                    <span
                                      className={`px-2 py-1 rounded-full text-xs ${
                                        mantenimiento.estado === "Pendiente"
                                          ? "bg-yellow-100 text-yellow-800"
                                          : "bg-blue-100 text-blue-800"
                                      }`}
                                    >
                                      {mantenimiento.estado}
                                    </span>
                                  </TableCell>
                                );
                              }

                              if (column.id === "acciones") {
                                return (
                                  <TableCell key={key}>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() =>
                                        toast.info(
                                          `Ver detalles de ${
                                            mantenimiento
                                              .mantenimiento_detalle?.[0]
                                              ?.equipos?.nombre_equipo ||
                                            "equipo"
                                          }`
                                        )
                                      }
                                    >
                                      Ver
                                    </Button>
                                  </TableCell>
                                );
                              }

                              if (column.accessor) {
                                const value =
                                  mantenimiento[
                                    column.accessor as keyof typeof mantenimiento
                                  ];

                                let content: React.ReactNode;

                                if (value === null || value === undefined) {
                                  content = "—";
                                } else if (typeof value === "object") {
                                  if ("nombre" in value) {
                                    content = (value as any).nombre;
                                  } else if (value instanceof Date) {
                                    content = value.toLocaleDateString("es-CO");
                                  } else {
                                    content = JSON.stringify(value);
                                  }
                                } else if (
                                  column.accessor === "fecha_programada" &&
                                  typeof value === "string"
                                ) {
                                  content = formatFecha(value);
                                } else {
                                  content = value;
                                }

                                return (
                                  <TableCell
                                    key={key}
                                    className={column.className}
                                  >
                                    {content}
                                  </TableCell>
                                );
                              }

                              return <TableCell key={key}></TableCell>;
                            })}
                        </TableRow>
                      );
                    })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgramacionMantenimiento;
