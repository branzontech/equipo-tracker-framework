/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Sucursal, SucursalConEstado } from "../interfaces/sucursales";
import {
  registerSucursal,
  getsucursales,
  deleteSucursal,
} from "../../../../api/axios/sucursal.api";
import { ColumnConfig } from "../interfaces/columns";

export const useSucursales = () => {
  const [sucursales, setSucursales] = useState<SucursalConEstado[]>([]);
  const [newSucursal, setNewSucursal] = useState<Sucursal>({
    id_sucursal: 0,
    nombre: "",
    sede_id: 0,
    tipo: "",
    estado: null,
    sedes: null,
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("ubicaciones");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getsucursales();
        const Sucursales = response.map((sucu: any) => ({
          ...sucu,
          numeroiD: `SUCUR${sucu.id_sucursal.toString().padStart(3, "0")}`,
          sede: sucu.sedes?.nombre || "Sin Sede",
          estado: sucu.estado ? "Activa" : "Inactiva",
        }));
        setSucursales(Sucursales);
      } catch (error) {
        throw new Error(error.message);
      }
    };
    fetchData();
  }, []);

  const handleCreateSucursales = async (sucursal: Sucursal) => {
    try {
      const response = await registerSucursal(sucursal);
      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  const [filters, setFilters] = useState({
    nombre: "",
    tipo: "",
    estado: "",
    sede: "",
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      id: "numeroiD",
      label: "N° Id",
      key: "numeroiD",
      isVisible: true,
      order: 0,
    },
    {
      id: "nombre",
      label: "Nombre",
      key: "nombre",
      isVisible: true,
      order: 1,
    },
    { id: "tipo", label: "Tipo", key: "tipo", isVisible: true, order: 2 },
    { id: "sede", label: "Sede", key: "sede", isVisible: true, order: 3 },
    {
      id: "estado",
      label: "Estado",
      key: "estado",
      isVisible: true,
      order: 4,
    },
  ]);

  const handleDragStart = (e: React.DragEvent, columnId: string) => {
    setDraggedColumn(columnId);
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.add("opacity-50", "cursor-grabbing");
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const draggedElement = e.currentTarget as HTMLElement;
    draggedElement.classList.remove("opacity-50", "cursor-grabbing");
    setDraggedColumn(null);
  };

  const handleDragOver = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.add(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );
  };

  const handleDragLeave = (e: React.DragEvent) => {
    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );
  };

  const handleDrop = (e: React.DragEvent, targetColumnId: string) => {
    e.preventDefault();
    if (!draggedColumn || draggedColumn === targetColumnId) return;

    const targetElement = e.currentTarget as HTMLElement;
    targetElement.classList.remove(
      "bg-muted",
      "transition-colors",
      "duration-200"
    );

    setColumns((prevColumns) => {
      const draggedColumnOrder =
        prevColumns.find((col) => col.id === draggedColumn)?.order || 0;
      const targetColumnOrder =
        prevColumns.find((col) => col.id === targetColumnId)?.order || 0;

      return prevColumns.map((column) => {
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

  const applyFilters = (data: typeof sucursales) => {
    return data.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!matchesSearch) return false;

      if (
        filters.tipo &&
        filters.tipo !== "todas" &&
        item.tipo.toLowerCase() !== filters.tipo.toLowerCase()
      )
        return false;
      if (
        filters.estado &&
        filters.estado !== "todos" &&
        String(item.estado) !== filters.estado
      )
        return false;

      if (
        filters.sede &&
        filters.sede !== "todas" &&
        item.sedes?.nombre.toLowerCase() !== filters.sede.toLowerCase()
      )
        return false;

      return true;
    });
  };

  const handleFilterChange = (field: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilters({
      nombre: "",
      tipo: "",
      estado: "",
      sede: "",
    });
    setCurrentPage(1);
  };
  const filteredData = applyFilters(sucursales);

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

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  const uniqueTipos = Array.from(new Set(sucursales.map((item) => item.tipo)));

  const uniqueEstados = Array.from(
    new Set(sucursales.map((item) => item?.estado))
  );
  const uniqueSedes = Array.from(
    new Set(sucursales.map((item) => item.sedes?.nombre || "Sin Sede"))
  );

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "todas" && value !== "todos"
  ).length;

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar esta sucursal?"))
      return;
    try {
      const response = await deleteSucursal(id);

      if (response.success) {
        window.location.reload();
      }
      return response;
    } catch (error) {
      throw new Error(error.message);
    }
  };

  return {
    handleDelete,
    newSucursal,
    setNewSucursal,
    sucursales,
    setSucursales,
    handleCreateSucursales,
    columns,
    setColumns,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    applyFilters,
    handleFilterChange,
    resetFilters,
    filteredData,
    sortedData,
    totalPages,
    startIndex,
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
    setSortField,
    sortDirection,
    setSortDirection,
    currentPage,
    setCurrentPage,
    filters,
    setFilters,
    activeTab,
    setActiveTab,
  };
};
