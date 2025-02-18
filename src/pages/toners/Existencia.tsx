import { useState } from "react";
import { Eye, Search, ArrowUp, ArrowDown, AlertTriangle, Download, SlidersHorizontal } from "lucide-react";
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

const sampleData = [
  {
    id: 1,
    referencia: "TN-760",
    modeloImpresora: "Brother DCP-L2540DW",
    color: "Negro",
    stockDisponible: 5,
    alertaStockMinimo: 2,
    areas: "Contabilidad",
    sede: "Sede Norte",
    cantidad: 10,
  },
  {
    id: 2,
    referencia: "CF410A",
    modeloImpresora: "HP LaserJet Pro M452dn",
    color: "Negro",
    stockDisponible: 3,
    alertaStockMinimo: 3,
    areas: "Recursos Humanos",
    sede: "Sede Sur",
    cantidad: 8,
  },
  {
    id: 3,
    referencia: "CF411A",
    modeloImpresora: "HP LaserJet Pro M452dn",
    color: "Cyan",
    stockDisponible: 4,
    alertaStockMinimo: 2,
    areas: "Gerencia",
    sede: "Sede Centro",
    cantidad: 6,
  },
];

const ExistenciaToners = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("todos");
  const [selectedSede, setSelectedSede] = useState<string>("todas");
  const itemsPerPage = 5;

  const [visibleColumns, setVisibleColumns] = useState({
    referencia: true,
    modeloImpresora: true,
    color: true,
    stockDisponible: true,
    alertaStockMinimo: true,
    areas: true,
    sede: true,
    cantidad: true,
  });

  const filteredData = sampleData.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesColor = selectedColor === "todos" ? true : item.color.toLowerCase() === selectedColor.toLowerCase();
    const matchesSede = selectedSede === "todas" ? true : item.sede.toLowerCase() === selectedSede.toLowerCase();
    return matchesSearch && matchesColor && matchesSede;
  });

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const handleDownload = () => {
    const csvContent = [
      Object.keys(sampleData[0]).join(","),
      ...filteredData.map(item => Object.values(item).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'toners.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedColor("todos");
    setSelectedSede("todas");
    setCurrentPage(1);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Existencia de Toners</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar toners..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={selectedColor} onValueChange={setSelectedColor}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por color" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos los colores</SelectItem>
            <SelectItem value="negro">Negro</SelectItem>
            <SelectItem value="cyan">Cyan</SelectItem>
            <SelectItem value="magenta">Magenta</SelectItem>
            <SelectItem value="amarillo">Amarillo</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedSede} onValueChange={setSelectedSede}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por sede" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas las sedes</SelectItem>
            <SelectItem value="sede norte">Sede Norte</SelectItem>
            <SelectItem value="sede sur">Sede Sur</SelectItem>
            <SelectItem value="sede centro">Sede Centro</SelectItem>
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
              <DropdownMenuLabel>Columnas visibles</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.entries(visibleColumns).map(([key, value]) => (
                <DropdownMenuCheckboxItem
                  key={key}
                  checked={value}
                  onCheckedChange={(checked) =>
                    setVisibleColumns(prev => ({ ...prev, [key]: checked }))
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
              {Object.entries(visibleColumns).map(([key, visible]) => 
                visible && (
                  <TableHead
                    key={key}
                    onClick={() => handleSort(key)}
                    className="cursor-pointer"
                  >
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                    {sortField === key && (
                      sortDirection === "asc" ? 
                        <ArrowUp className="inline ml-1 h-4 w-4" /> : 
                        <ArrowDown className="inline ml-1 h-4 w-4" />
                    )}
                  </TableHead>
                )
              )}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {Object.entries(visibleColumns).map(([key, visible]) => 
                  visible && (
                    <TableCell key={key}>
                      {key === 'stockDisponible' ? (
                        <div className="flex items-center gap-2">
                          {item[key]}
                          {item.stockDisponible <= item.alertaStockMinimo && (
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
                  <Button variant="ghost" size="icon">
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                onClick={() => setCurrentPage(page => Math.max(1, page - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
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
                onClick={() => setCurrentPage(page => Math.min(totalPages, page + 1))}
                className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default ExistenciaToners;
