/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { TonerImpresora } from "../interfaces/toner-impresora";
import { getTonerImpresora } from "@/api/axios/toner-impresora.api";

const useTonerImpresora = () => {
  const [tonerImpresora, setTonerImpresora] = useState<TonerImpresora[]>([]);
  const [normalizedData, setNormalizedData] = useState<any[]>([]);
  const [newTonerImpresora, setNewTonerImpresora] = useState<TonerImpresora>({
    toner_id: 0,
    impresora_id: 0,
    toner: {
      id_toner: 0,
      modelo: "",
      color: "",
      cantidad: 0,
      stock_actual: 0,
      stock_minimo_alerta: 0,
      impresoras: [],
    },
    impresora: {
      id_impresora: 0,
      nombre: "",
      modelo: "",
      sucursal_id: 0,
      sucursales: {
        id_sucursal: 0,
        nombre: "",
        sede_id: 0,
        tipo: "",
        estado: null,
        sedes: {
          id_sede: 0,
          nombre: "",
          usuarios: [],
          estado: null,
        },
      },
    },
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>("todos");
  const [selectedSede, setSelectedSede] = useState<string>("todas");
  const itemsPerPage = 5;

  useEffect(() => {
    const getAllTonerImpresora = async () => {
      try {
        const data = await getTonerImpresora();
        setTonerImpresora(data);

        // Normalizar datos para la tabla
        const normalized = data.map((item) => ({
          id: item.toner_id,
          modelo: item.toner.modelo,
          color: item.toner.color,
          stock: item.toner.stock_actual,
          alerta: item.toner.stock_minimo_alerta,
          cantidad: item.toner.cantidad,
          modeloImpresora: item.impresoras.modelo,
          sede: item.impresoras.sucursales.sedes.nombre,
          sucursal: item.impresoras.sucursales.nombre,
        }));

        setNormalizedData(normalized);
      } catch (error) {
        console.log(error);
      }
    };

    getAllTonerImpresora();
  }, []);

  const [visibleColumns, setVisibleColumns] = useState({
    modelo: true,
    modeloImpresora: true,
    color: true,
    stock: true,
    alerta: true,
    sucursal: true,
    sede: true,
    cantidad: true,
  });

  const filteredData = normalizedData.filter((item) => {
    const matchesSearch = Object.values(item).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesColor =
      selectedColor === "todos"
        ? true
        : item.color.toLowerCase() === selectedColor.toLowerCase();
    const matchesSede =
      selectedSede === "todas"
        ? true
        : item.sede.toLowerCase() === selectedSede.toLowerCase();

    return matchesSearch && matchesColor && matchesSede;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField]! > b[sortField]! ? 1 : -1;
    }
    return a[sortField]! < b[sortField]! ? 1 : -1;
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
      Object.keys(normalizedData[0]).join(","),
      ...filteredData.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "toners.csv");
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

  return {
    newTonerImpresora,
    setNewTonerImpresora,
    searchTerm,
    selectedColor,
    selectedSede,
    currentPage,
    handleSort,
    handleDownload,
    resetFilters,
    visibleColumns,
    filteredData,
    sortedData,
    totalPages,
    startIndex,
    paginatedData,
    setSearchTerm,
    setSelectedColor,
    setSelectedSede,
    setCurrentPage,
    setVisibleColumns,
    sortField,
    sortDirection,
  };
};

export default useTonerImpresora;
