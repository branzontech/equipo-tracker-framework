import {
  Eye,
  Search,
  ArrowUp,
  ArrowDown,
  AlertTriangle,
  Download,
  SlidersHorizontal,
  PencilIcon,
  TrashIcon,
  XCircle,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTonerImpresora from "../hooks/use-toner-impresora";
import UpdateToner from "./EditToner";
import { useToners } from "../hooks/use-toners";
import { useGlobal } from "@/hooks/use-global";

const ExistenciaToners = () => {
  const {
    searchTerm,
    selectedColor,
    selectedSede,
    currentPage,
    handleSort,
    handleDownload,
    resetFilters,
    visibleColumns,
    totalPages,
    paginatedData,
    setSearchTerm,
    setSelectedColor,
    setSelectedSede,
    setCurrentPage,
    setVisibleColumns,
    sortField,
    filteredData,
    sortDirection,
    uniqueColors,
    uniqueSedes,
    showEditModal,
    setShowEditModal,
    selectedTonerId,
    handleOpenEditModal,
  } = useTonerImpresora();
  const { deleteTonerById } = useToners();
  const { StatusBadge } = useGlobal();

  return (
    <>
      <div className="p-8">
        <h1 className="text-2xl font-bold text-[#040d50] mb-6">
          Existencia de Toners
        </h1>

        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-[#040d50]" />
            <Input
              placeholder="Buscar toners..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Select value={selectedColor} onValueChange={setSelectedColor}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Filtrar por color"
                className="text-[#040d50]"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos los colores</SelectItem>
              {uniqueColors.map((color, index) => (
                <SelectItem key={index} value={color}>
                  {color}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSede} onValueChange={setSelectedSede}>
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder="Filtrar por sede"
                className="text-[#040d50]"
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas las sedes</SelectItem>
              {uniqueSedes.map((sede, index) => (
                <SelectItem key={index} value={sede}>
                  {sede}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel className="text-[#040d50]">
                  Columnas visibles
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(visibleColumns).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={(checked) =>
                      setVisibleColumns((prev) => ({ ...prev, [key]: checked }))
                    }
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="outline" onClick={handleDownload}>
              <Download className="h-4 w-4 mr-2" />
              Descargar CSV
            </Button>
            <Button variant="outline" onClick={resetFilters}>
              Limpiar filtros
            </Button>
          </div>
        </div>

        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                {Object.entries(visibleColumns).map(
                  ([key, visible]) =>
                    visible && (
                      <TableHead
                        key={key}
                        onClick={() => handleSort(key)}
                        className="cursor-pointer text-[#040d50] hover:text-[#040d50]/80"
                      >
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                        {sortField === key &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="inline ml-1 h-4 w-4" />
                          ) : (
                            <ArrowDown className="inline ml-1 h-4 w-4" />
                          ))}
                      </TableHead>
                    )
                )}
                <TableHead className="text-[#040d50]">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                paginatedData.map((item) => (
                  <TableRow key={item.id}>
                    {Object.entries(visibleColumns).map(
                      ([key, visible]) =>
                        visible && (
                          <TableCell key={key}>
                            {key === "estado" ? (
                              <StatusBadge status={item[key]} />
                            ) : key === "stock" ? (
                              <div className="flex items-center gap-2">
                                {item[key]}
                                {item.stock <=
                                  item.alerta && (
                                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                                )}
                              </div>
                            ) : (
                              item[key]
                            )}
                          </TableCell>
                        )
                    )}
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenEditModal(item.id)}
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteTonerById(item.id)}
                      >
                        <XCircle className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      Object.entries(visibleColumns).filter((col) => col[1])
                        .length + 1
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

        <div className="mt-4">
          <div className="text-sm text-gray-500">
            Mostrando {paginatedData.length} de {filteredData.length} registros
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
      </div>

      {showEditModal && selectedTonerId && (
        <UpdateToner
          open={showEditModal}
          onOpenChange={setShowEditModal}
          id={selectedTonerId}
        />
      )}
    </>
  );
};

export default ExistenciaToners;
