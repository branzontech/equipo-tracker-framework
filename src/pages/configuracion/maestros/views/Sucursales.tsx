/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowDown,
  ArrowUp,
  Filter,
  GripVertical,
  PencilIcon,
  PlusCircle,
  Search,
  X,
  XCircle,
} from "lucide-react";
import { useSedes } from "../hooks/use-sedes";
import { Tabs, TabsContent } from "@radix-ui/react-tabs";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useSucursales } from "../hooks/use-sucursales";
import UpdateSucursal from "./UpdateSucursal";
import { useGlobal } from "@/hooks/use-global";
import { useEstado } from "../hooks/use-estado";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { tienePermiso } from "@/utils/permissions";
import { PERMISOS_SUCURSALES } from "../../usuarios/interfaces/permisos";

const Ubicaciones = () => {
  const {
    newSucursal,
    setNewSucursal,
    handleCreateSucursales,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleFilterChange,
    resetFilters,
    filteredData,
    totalPages,
    paginatedData,
    handleSort,
    sortedColumns,
    uniqueTipos,
    uniqueEstados,
    uniqueSedes,
    activeFiltersCount,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    currentPage,
    setCurrentPage,
    filters,
    setActiveTab,
    handleDelete,
    setShowEditModal,
    showEditModal,
    selectedSucursal,
    handleOpenEditModal,
    uniqueAreas,
  } = useSucursales();
  const { sedes } = useSedes();
  const { StatusBadge } = useGlobal();
  const { estados } = useEstado();
  const user = useSelector((state: RootState) => state.auth.user);

  const puedeEditarEliminar =
    tienePermiso(PERMISOS_SUCURSALES.edicion, user.permisos) ||
    tienePermiso(PERMISOS_SUCURSALES.eliminacion, user.permisos);

  return (
    <div className="container mx-auto p-6">
      {tienePermiso(PERMISOS_SUCURSALES.ingreso, user.permisos) && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Gestión de Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-5">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  value={newSucursal.nombre}
                  onChange={(e) =>
                    setNewSucursal({ ...newSucursal, nombre: e.target.value })
                  }
                  placeholder="Ingrese el nombre"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={newSucursal.tipo}
                  onValueChange={(value) =>
                    setNewSucursal({ ...newSucursal, tipo: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione el tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Administrativa">
                      Administrativa
                    </SelectItem>
                    <SelectItem value="Departamento">Departamento</SelectItem>
                    <SelectItem value="Ubicacion Terciaria">
                      Ubicacion Terciaria
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area</Label>
                <Input
                  value={newSucursal.area}
                  onChange={(e) =>
                    setNewSucursal({ ...newSucursal, area: e.target.value })
                  }
                  placeholder="Ingrese el area"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sedes">Sedes</Label>
                <Select
                  value={
                    newSucursal.sede_id ? newSucursal.sede_id.toString() : ""
                  }
                  onValueChange={(value) =>
                    setNewSucursal({ ...newSucursal, sede_id: Number(value) })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Seleccione la sede" />
                  </SelectTrigger>
                  <SelectContent>
                    {sedes.map((sede) => (
                      <SelectItem
                        key={sede.id_sede}
                        value={sede.id_sede.toString()}
                      >
                        {sede.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={newSucursal.estado || ""}
                  onValueChange={(value) => {
                    setNewSucursal({
                      ...newSucursal,
                      estado: value,
                    });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {estados.map((estado) => (
                      <SelectItem
                        key={estado.id_estado}
                        value={estado.nombre_estado}
                      >
                        {estado.nombre_estado}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="submit"
                  className="w-full"
                  onClick={(e: React.FormEvent) => {
                    e.preventDefault();
                    handleCreateSucursales(newSucursal);
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Registrar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs
        defaultValue="sucursales"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#040d50]">
            Listado de Sucursales
          </h1>
        </div>

        <TabsContent value="sucursales" className="mt-0">
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar sucursal..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className={
                      activeFiltersCount > 0 ? "relative bg-slate-100" : ""
                    }
                  >
                    <Filter className="h-4 w-4" />
                    {activeFiltersCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-primary text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-full max-w-md sm:max-w-lg"
                >
                  <SheetHeader>
                    <SheetTitle className="text-xl font-semibold mb-2">
                      Filtros Avanzados
                    </SheetTitle>
                  </SheetHeader>

                  <div className="mt-6 space-y-6">
                    <div className="grid grid-cols-1 gap-y-6">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Tipo</label>
                        <Select
                          value={filters.tipo}
                          onValueChange={(value) =>
                            handleFilterChange("tipo", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar tipo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueTipos.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Area</label>
                        <Select
                          value={filters.area}
                          onValueChange={(value) =>
                            handleFilterChange("area", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar area" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueAreas.map((area) => (
                              <SelectItem key={area} value={area}>
                                {area}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Estado</label>
                        <Select
                          value={filters.estado}
                          onValueChange={(value) =>
                            handleFilterChange("estado", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar estado" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todos">Todos</SelectItem>
                            {uniqueEstados.map((estado) => (
                              <SelectItem
                                key={String(estado)}
                                value={String(estado)}
                              >
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Sede</label>
                        <Select
                          value={filters.sede}
                          onValueChange={(value) =>
                            handleFilterChange("sede", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar sede" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueSedes.map((sede) => (
                              <SelectItem key={sede} value={sede}>
                                {sede}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex justify-end">
                      <Button
                        variant="outline"
                        onClick={resetFilters}
                        className="mr-2"
                      >
                        Limpiar filtros
                      </Button>
                      <Button>Aplicar filtros</Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "todas" || value === "todos")
                  return null;

                const label = {
                  nombre: "Nombre",
                  tipo: "Tipo",
                  estado: "Estado",
                  sede: "Sede",
                  area: "Area",
                }[key];

                return (
                  <Badge
                    key={key}
                    variant="outline"
                    className="px-3 py-1 bg-slate-100 gap-2"
                  >
                    <span className="font-medium">{label}:</span>
                    <span>{value}</span>
                    <button
                      className="ml-1 hover:text-destructive"
                      onClick={() =>
                        handleFilterChange(key as keyof typeof filters, "")
                      }
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}

              {activeFiltersCount > 1 && (
                <button
                  className="text-xs text-muted-foreground underline hover:text-destructive"
                  onClick={resetFilters}
                >
                  Limpiar todos
                </button>
              )}
            </div>
          )}

          <div className="border rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow>
                  {sortedColumns.map(
                    (column) =>
                      column.isVisible && (
                        <TableHead
                          key={column.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, column.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, column.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, column.id)}
                          className="cursor-grab transition-all duration-200 hover:bg-slate-200 font-semibold"
                        >
                          <div className="flex items-center gap-2 select-none">
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                            <div
                              className="flex items-center gap-2"
                              onClick={() => handleSort(column.key)}
                            >
                              {column.label}
                              {sortField === column.key &&
                                (sortDirection === "asc" ? (
                                  <ArrowUp className="inline h-4 w-4" />
                                ) : (
                                  <ArrowDown className="inline h-4 w-4" />
                                ))}
                            </div>
                          </div>
                        </TableHead>
                      )
                  )}
                  {puedeEditarEliminar && (
                    <TableHead className="font-semibold">Acciones</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  [...paginatedData]
                    .sort((a, b) => b.id_sucursal - a.id_sucursal)
                    .map((item) => {
                      const acciones = [
                        {
                          permiso: PERMISOS_SUCURSALES.edicion,
                          onClick: () => handleOpenEditModal(item.id_sucursal),
                          icon: <PencilIcon className="h-5 w-5" />,
                        },
                        {
                          permiso: PERMISOS_SUCURSALES.eliminacion,
                          onClick: () => handleDelete(item.id_sucursal),
                          icon: <XCircle className="h-5 w-5" />,
                        },
                      ];

                      return (
                        <TableRow
                          key={item.id_sucursal}
                          className="hover:bg-slate-50"
                        >
                          {sortedColumns.map(
                            (column) =>
                              column.isVisible && (
                                <TableCell
                                  key={`${item.id_sucursal}-${column.id}`}
                                  className="py-3"
                                >
                                  {column.id === "estado" ? (
                                    <StatusBadge
                                      status={
                                        item[
                                          column.key as keyof typeof item
                                        ] as string
                                      }
                                    />
                                  ) : typeof item[
                                      column.key as keyof typeof item
                                    ] === "object" &&
                                    item[column.key as keyof typeof item] !==
                                      null ? (
                                    (
                                      item[
                                        column.key as keyof typeof item
                                      ] as any
                                    ).descripcion ?? ""
                                  ) : (
                                    item[column.key as keyof typeof item]
                                  )}
                                </TableCell>
                              )
                          )}
                          {puedeEditarEliminar && (
                            <TableCell>
                              <div className="flex gap-2">
                                {acciones.map(
                                  (accion, idx) =>
                                    tienePermiso(
                                      accion.permiso,
                                      user.permisos
                                    ) && (
                                      <Button
                                        key={idx}
                                        variant="ghost"
                                        size="icon"
                                        className="hover:bg-slate-100"
                                        onClick={accion.onClick}
                                      >
                                        {accion.icon}
                                      </Button>
                                    )
                                )}
                              </div>
                            </TableCell>
                          )}
                        </TableRow>
                      );
                    })
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={
                        sortedColumns.filter((col) => col.isVisible).length + 1
                      }
                      className="h-24 text-center"
                    >
                      No se encontraron resultados.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              Mostrando {paginatedData.length} de {filteredData.length}{" "}
              registros
            </div>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() =>
                      setCurrentPage((page) => Math.max(1, page - 1))
                    }
                    className={
                      currentPage === 1
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => (
                  <PaginationItem key={index + 1}>
                    <PaginationLink
                      onClick={() => setCurrentPage(index + 1)}
                      isActive={currentPage === index + 1}
                      className={
                        currentPage === index + 1
                          ? "bg-[#01242c] text-white"
                          : ""
                      }
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    onClick={() =>
                      setCurrentPage((page) => Math.min(totalPages, page + 1))
                    }
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : "cursor-pointer"
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </TabsContent>
      </Tabs>

      <UpdateSucursal
        open={showEditModal}
        onOpenChange={setShowEditModal}
        id={selectedSucursal}
      />
    </div>
  );
};

export default Ubicaciones;
