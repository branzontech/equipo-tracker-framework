
import { useState } from "react";
import { Eye, Pencil, Search, ArrowUp, ArrowDown } from "lucide-react";
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

// Datos de muestra
const sampleData = [
  {
    id: 1,
    numeroSerie: "SN001",
    descripcion: "Laptop Dell XPS 13",
    marca: "Dell",
    estado: "Activo",
    ubicacion: "TI",
    responsable: "Juan Pérez",
  },
  {
    id: 2,
    numeroSerie: "SN002",
    descripcion: "Monitor LG 27'",
    marca: "LG",
    estado: "Activo",
    ubicacion: "Desarrollo",
    responsable: "María García",
  },
  {
    id: 3,
    numeroSerie: "SN003",
    descripcion: "Impresora HP LaserJet",
    marca: "HP",
    estado: "Mantenimiento",
    ubicacion: "Administración",
    responsable: "Pedro López",
  },
  {
    id: 4,
    numeroSerie: "SN004",
    descripcion: "MacBook Pro M1",
    marca: "Apple",
    estado: "Activo",
    ubicacion: "Diseño",
    responsable: "Ana Martínez",
  },
  {
    id: 5,
    numeroSerie: "SN005",
    descripcion: "Proyector Epson",
    marca: "Epson",
    estado: "Inactivo",
    ubicacion: "Sala Reuniones",
    responsable: "Carlos Sánchez",
  },
  {
    id: 6,
    numeroSerie: "SN006",
    descripcion: "Router Cisco",
    marca: "Cisco",
    estado: "Activo",
    ubicacion: "Redes",
    responsable: "Luis Ramírez",
  },
  {
    id: 7,
    numeroSerie: "SN007",
    descripcion: "Scanner Brother",
    marca: "Brother",
    estado: "Activo",
    ubicacion: "Recepción",
    responsable: "Diana Torres",
  },
  {
    id: 8,
    numeroSerie: "SN008",
    descripcion: "UPS APC",
    marca: "APC",
    estado: "Activo",
    ubicacion: "Servidor",
    responsable: "Roberto Flores",
  },
  {
    id: 9,
    numeroSerie: "SN009",
    descripcion: "Tablet Samsung",
    marca: "Samsung",
    estado: "Reparación",
    ubicacion: "Ventas",
    responsable: "Patricia Ruiz",
  },
  {
    id: 10,
    numeroSerie: "SN010",
    descripcion: "Desktop HP",
    marca: "HP",
    estado: "Activo",
    ubicacion: "Contabilidad",
    responsable: "Miguel Ángel",
  },
];

const ListaInventario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Filtrar por búsqueda
  const filteredData = sampleData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Ordenar datos
  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  // Paginación
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Lista de Inventario</h1>
      
      {/* Barra de búsqueda */}
      <div className="flex mb-6">
        <div className="relative w-full max-w-md">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar equipos..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabla */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort("numeroSerie")} className="cursor-pointer">
                N° Serie
                {sortField === "numeroSerie" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("descripcion")} className="cursor-pointer">
                Descripción
                {sortField === "descripcion" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("marca")} className="cursor-pointer">
                Marca
                {sortField === "marca" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("estado")} className="cursor-pointer">
                Estado
                {sortField === "estado" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("ubicacion")} className="cursor-pointer">
                Ubicación
                {sortField === "ubicacion" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead onClick={() => handleSort("responsable")} className="cursor-pointer">
                Responsable
                {sortField === "responsable" && (
                  sortDirection === "asc" ? <ArrowUp className="inline ml-1 h-4 w-4" /> : <ArrowDown className="inline ml-1 h-4 w-4" />
                )}
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.numeroSerie}</TableCell>
                <TableCell>{item.descripcion}</TableCell>
                <TableCell>{item.marca}</TableCell>
                <TableCell>{item.estado}</TableCell>
                <TableCell>{item.ubicacion}</TableCell>
                <TableCell>{item.responsable}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Paginación */}
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

export default ListaInventario;
