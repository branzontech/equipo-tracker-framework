/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Eye,
  Pencil,
  Search,
  ArrowUp,
  ArrowDown,
  Download,
  SlidersHorizontal,
  GripVertical,
  Plus,
  Filter,
  X,
  Delete,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useEquipos } from "../hooks/use-equipos";
import Perifericos from "@/pages/configuracion/maestros/views/Perifericos";

import { CheckCircle, FileX, Wrench, ShieldAlert } from "lucide-react";

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "activo":
      return (
        <div className="flex items-center space-x-1 text-green-700">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <span>Activo</span>
        </div>
      );
    case "inactivo":
      return (
        <div className="flex items-center space-x-1 text-gray-500">
          <FileX className="h-4 w-4 text-gray-400" />
          <span>Inactivo</span>
        </div>
      );
    case "fuera de servicio":
      return (
        <div className="flex items-center space-x-1 text-orange-700">
          <FileX className="mr-2 h-4 w-4 text-orange-500" />
          <span>Fuera de servicio</span>
        </div>
      );
    case "mantenimiento":
      return (
        <div className="flex items-center space-x-1 text-amber-700">
          <Wrench className="h-4 w-4 text-amber-500" />
          <span>Mantenimiento</span>
        </div>
      );
    case "reparación":
      return (
        <div className="flex items-center space-x-1 text-red-700">
          <ShieldAlert className="h-4 w-4 text-red-500" />
          <span>Reparación</span>
        </div>
      );
    default:
      return (
        <div className="flex items-center space-x-1 text-slate-600">
          <FileX className="h-4 w-4 text-slate-400" />
          <span>{status}</span>
        </div>
      );
  }
};

const ListaInventario = () => {
  const {
    setActiveTab,
    searchTerm,
    setSearchTerm,
    handleSort,
    paginatedData,
    totalPages,
    handleDownload,
    uniqueMarcas,
    uniqueEstados,
    uniqueSucursales,
    activeFiltersCount,
    sortedColumns,
    handleDragEnd,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    sortField,
    sortDirection,
    filteredData,
    navigate,
    currentPage,
    setCurrentPage,
    columns,
    activeTab,
    handleNuevoProducto,
    filters,
    handleFilterChange,
    resetFilters,
    toggleColumnVisibility,
    uniqueCategorias,
    deleteEquipoById,
  } = useEquipos();

  return (
    <div className="p-8">
      <Tabs
        defaultValue="inventario"
        onValueChange={setActiveTab}
        className="w-full"
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#040d50]">
              Lista de Inventario
            </h1>
            <TabsList className="mt-4">
              <TabsTrigger value="inventario">Equipos</TabsTrigger>
              <TabsTrigger value="perifericos">Periféricos</TabsTrigger>
            </TabsList>
          </div>
          <Button
            onClick={
              activeTab === "inventario" ? handleNuevoProducto : undefined
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            {activeTab === "inventario" ? "Nuevo Producto" : "Nuevo Periférico"}
          </Button>
        </div>

        <TabsContent value="inventario" className="mt-0">
          <div className="flex justify-between mb-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar equipos..."
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
                        <label className="text-sm font-medium">Marca</label>
                        <Select
                          value={filters.marcas}
                          onValueChange={(value) =>
                            handleFilterChange("marcas", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar marca" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueMarcas.map((marcas, index) => (
                              <SelectItem
                                key={`${marcas}-${index}`}
                                value={marcas}
                              >
                                {marcas}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Categorias
                        </label>
                        <Select
                          value={filters.categorias}
                          onValueChange={(value) =>
                            handleFilterChange("categorias", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar una categoria" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueCategorias.map((categorias, index) => (
                              <SelectItem
                                key={`${categorias}-${index}`}
                                value={categorias}
                              >
                                {categorias}
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
                            {uniqueEstados.map((estado, index) => (
                              <SelectItem
                                key={`${estado}-${index}`}
                                value={estado}
                              >
                                {estado}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Sucursales
                        </label>
                        <Select
                          value={filters.sucursales}
                          onValueChange={(value) =>
                            handleFilterChange("sucursales", value)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Seleccionar sucursal" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="todas">Todas</SelectItem>
                            {uniqueSucursales.map((sucursal) => (
                              <SelectItem key={sucursal} value={sucursal}>
                                {sucursal}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {/* <div className="space-y-2">
                        <label className="text-sm font-medium">
                          Responsable
                        </label>
                        <Input
                          placeholder="Buscar por responsable"
                          value={filters.responsable}
                          onChange={(e) =>
                            handleFilterChange("responsable", e.target.value)
                          }
                        />
                      </div> */}
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

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {columns.map((column) => (
                    <div key={column.id} className="px-2 py-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={column.isVisible}
                          onCheckedChange={(checked) =>
                            toggleColumnVisibility(
                              column.id,
                              checked as boolean
                            )
                          }
                          id={`checkbox-${column.id}`}
                        />
                        <label
                          htmlFor={`checkbox-${column.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {column.label}
                        </label>
                      </div>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              <Button variant="outline" onClick={handleDownload}>
                <Download className="h-4 w-4 mr-2" />
                Descargar CSV
              </Button>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(filters).map(([key, value]) => {
                if (!value || value === "todas" || value === "todos")
                  return null;

                const label = {
                  marcas: "Marca",
                  estado: "Estado",
                  sede: "Sede",
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
                  <TableHead className="font-semibold">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length > 0 ? (
                  [...paginatedData]
                    .sort(
                      (a, b) =>
                        new Date(b.fecha_registro).getTime() -
                        new Date(a.fecha_registro).getTime()
                    )
                    .map((item) => (
                      <TableRow
                        key={item.id_equipo}
                        className="hover:bg-slate-50"
                      >
                        {sortedColumns.map(
                          (column) =>
                            column.isVisible && (
                              <TableCell
                                key={`${item.id_equipo}-${column.id}`}
                                className="py-3"
                              >
                                {column.id === "estado_actual" ? (
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
                                  (item[column.key as keyof typeof item] as any)
                                    .nombre ?? ""
                                ) : (
                                  item[column.key as keyof typeof item]
                                )}
                              </TableCell>
                            )
                        )}
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-100"
                              onClick={() =>
                                navigate(`/hojas-vida/${item.nro_serie}`)
                              }
                            >
                              <Eye className="h-4 w-4 text-[#01242c]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-100"
                              onClick={() => navigate(`/productos/edit/${item.nro_serie}`)}
                            >
                              <Pencil className="h-4 w-4 text-[#01242c]" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="hover:bg-slate-100"
                              onClick={() => deleteEquipoById(item.id_equipo)}
                            >
                              <Delete className="h-4 w-4 text-[#01242c]" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
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

        <TabsContent value="perifericos" className="mt-0">
          <Perifericos />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ListaInventario;
