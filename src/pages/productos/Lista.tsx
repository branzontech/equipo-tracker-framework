import { useState } from "react";
import { Eye, Pencil, Search, ArrowUp, ArrowDown, Download, SlidersHorizontal, GripVertical } from "lucide-react";
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

type ColumnConfig = {
  id: string;
  label: string;
  key: string;
  isVisible: boolean;
  order: number;
};

const ListaInventario = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);

  const [columns, setColumns] = useState<ColumnConfig[]>([
    { id: "numeroSerie", label: "N° Serie", key: "numeroSerie", isVisible: true, order: 0 },
    { id: "descripcion", label: "Descripción", key: "descripcion", isVisible: true, order: 1 },
    { id: "marca", label: "Marca", key: "marca", isVisible: true, order: 2 },
    { id: "estado", label: "Estado", key: "estado", isVisible: true, order: 3 },
    { id: "ubicacion", label: "Ubicación", key: "ubicacion", isVisible: true, order: 4 },
    { id: "responsable", label: "Responsable", key: "responsable", isVisible: true, order: 5 }
  ]);

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add('opacity-50', 'cursor-grabbing');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove('opacity-50', 'cursor-grabbing');
    setDraggedColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;
    
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.add('bg-muted', 'transition-colors', 'duration-200');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove('bg-muted', 'transition-colors', 'duration-200');
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove('bg-muted', 'transition-colors', 'duration-200');

    setColumns(prevColumns => {
      const draggedColumnOrder = prevColumns.find(col => col.id === draggedColumn)?.order || 0;
      const targetColumnOrder = prevColumns.find(col => col.id === targetColumnId)?.order || 0;

      return prevColumns.map(column => {
        if (column.id === draggedColumn) {
          return { ...column, order: targetColumnOrder };
        }
        if (column.id === targetColumnId) {
          return { ...column, order: draggedColumnOrder };
        }
        return column;
      });
    });
  };

  const toggleColumnVisibility = (columnId: string, isChecked: boolean) => {
    setColumns(prevColumns =>
      prevColumns.map(column =>
        column.id === columnId ? { ...column, isVisible: isChecked } : column
      )
    );
  };

  const filteredData = sampleData.filter((item) =>
    Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

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
    a.setAttribute('download', 'inventario.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#040d50] mb-6">Lista de Inventario</h1>
      
      <div className="flex justify-between mb-6">
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
                      onCheckedChange={(checked) => toggleColumnVisibility(column.id, checked as boolean)}
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

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              {sortedColumns.map((column) => 
                column.isVisible && (
                  <TableHead
                    key={column.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, column.id)}
                    onDragEnd={handleDragEnd}
                    onDragOver={(e) => handleDragOver(e, column.id)}
                    onDragLeave={handleDragLeave}
                    onDrop={(e) => handleDrop(e, column.id)}
                    className="cursor-grab transition-all duration-200 hover:bg-muted/50"
                  >
                    <div className="flex items-center gap-2 select-none">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div className="flex items-center gap-2" onClick={() => handleSort(column.key)}>
                        {column.label}
                        {sortField === column.key && (
                          sortDirection === "asc" ? 
                            <ArrowUp className="inline h-4 w-4" /> : 
                            <ArrowDown className="inline h-4 w-4" />
                        )}
                      </div>
                    </div>
                  </TableHead>
                )
              )}
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.map((item) => (
              <TableRow key={item.id}>
                {sortedColumns.map((column) =>
                  column.isVisible && (
                    <TableCell key={`${item.id}-${column.id}`}>
                      {item[column.key as keyof typeof item]}
                    </TableCell>
                  )
                )}
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
