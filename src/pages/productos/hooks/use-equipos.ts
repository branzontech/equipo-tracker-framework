/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Equipo } from "../interfaces/equipo";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createEquipo,
  deleteEquipo,
  getEquipos,
  getEquiposByNroSerie,
} from "@/api/axios/equipo.api";
import { ColumnConfig } from "@/pages/configuracion/maestros/interfaces/columns";
import { toast } from "sonner";

export const useEquipos = () => {
  const [equipo, setEquipo] = useState<Equipo[]>([]);
  const [count, setCountEquipo] = useState<number>(0);
  const [newEquipo, setNewEquipo] = useState<Equipo>({
    id_equipo: 0,
    nombre_equipo: "",
    nro_serie: "",
    modelo: "",
    marca_id: 0,
    marcas: null,
    categoria_id: 0,
    categorias: null,
    sucursal_id: 0,
    sucursales: {
      id_sucursal: 0,
      nombre: "",
      sede_id: 0,
      sedes: {
        id_sede: 0,
        nombre: "",
        usuarios: [],
        estado: null,
      },
      tipo: "",
      estado: null,
    },
    estado_actual: "",
    fecha_registro: new Date().toISOString().split("T")[0],
    tipo_activo: "",
    garantia_fecha_fin: "",
    observaciones: "",
    especificaciones: {
      procesador: "",
      memoria_ram: "",
      almacenamiento: "",
      tarjeta_grafica: "",
      pantalla: "",
      sistema_operativo: "",
      bateria: "",
      puertos: "",
    },
    seguridad: {
      nivel_acceso: "",
      software_seguridad: "",
      cifrado_disco: "",
      politicas_aplicadas: [],
    },
    adquisicion: {
      orden_compra: "",
      fecha_compra: "",
      precio_compra: 0,
      forma_pago: "",
      plazo_pago: "",
      numero_factura: "",
      proveedor: "",
    },
    administrativa: {
      codigo_inventario: "",
      centro_coste: "",
      autorizado_por: "",
      fecha_activacion: "",
      estado_contable: "",
      valor_depreciado: 0,
      vida_util_restante: "",
    },
  });
  const navigate = useNavigate();
  const [draggedColumn, setDraggedColumn] = useState<string | null>(null);
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("inventario");
  const [sedesConEquiposCount, setSedesConEquiposCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getEquipos();
        const equipos = response.map((equipo: any) => ({
          ...equipo,
          sucursales: equipo.sucursales?.nombre || "Sin Sucursal",
          sedes: equipo.sucursales?.sedes?.nombre || "Sin Sede",
          tipo: equipo.sucursales?.tipo || "Sin Tipo",
          marcas: equipo.marcas?.nombre || "Sin Marca",
          categorias: equipo.categorias?.nombre || "Sin Categoria",
          estadoActual: equipo.estado_actual ? "Activo" : "Inactivo",
        }));
        setEquipo(equipos);
        setCountEquipo(equipos.length);

        const sedesConEquipos = new Set(
          response
            .filter((equipo: any) => equipo.sucursales?.sedes?.id_sede)
            .map((equipo: any) => equipo.sucursales?.sedes?.id_sede)
        );

        setSedesConEquiposCount(sedesConEquipos.size);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const [filters, setFilters] = useState({
    marcas: "",
    categorias: "",
    estado: "",
    sucursales: "",
    sedes: "",
  });

  const [columns, setColumns] = useState<ColumnConfig[]>([
    {
      id: "nro_serie",
      label: "N° Serie",
      key: "nro_serie",
      isVisible: true,
      order: 0,
    },
    {
      id: "nombre_equipo",
      label: "Nombre del Equipo",
      key: "nombre_equipo",
      isVisible: true,
      order: 1,
    },
    { id: "marcas", label: "Marca", key: "marcas", isVisible: true, order: 2 },
    {
      id: "categorias",
      label: "Categoria",
      key: "categorias",
      isVisible: true,
      order: 3,
    },
    { id: "sedes", label: "Sede", key: "sedes", isVisible: true, order: 5 },
    {
      id: "estado_actual",
      label: "Estado",
      key: "estado_actual",
      isVisible: true,
      order: 4,
    },
    {
      id: "sucursales",
      label: "Sucursal",
      key: "sucursales",
      isVisible: true,
      order: 6,
    },
    {
      id: "tipo",
      label: "Tipo de Sucursal",
      key: "tipo",
      isVisible: true,
      order: 6,
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

  const toggleColumnVisibility = (columnId: string, isChecked: boolean) => {
    setColumns((prevColumns) =>
      prevColumns.map((column) =>
        column.id === columnId ? { ...column, isVisible: isChecked } : column
      )
    );
  };

  const applyFilters = (data: typeof equipo) => {
    return data.filter((item) => {
      const matchesSearch = Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      if (!matchesSearch) return false;

      if (
        filters.marcas &&
        filters.marcas !== "todas" &&
        item.marcas.toString() !== filters.marcas
      )
        return false;

      if (
        filters.categorias &&
        filters.categorias !== "todas" &&
        item.categorias.toString() !== filters.categorias
      )
        return false;
      if (
        filters.estado &&
        filters.estado !== "todos" &&
        item.estado_actual.toLowerCase() !== filters.estado.toLowerCase()
      )
        return false;

      if (
        filters.sucursales &&
        filters.sucursales !== "todas" &&
        item.sucursales.toString() !== filters.sucursales
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
      marcas: "",
      categorias: "",
      estado: "",
      sucursales: "",
      sedes: "",
    });
    setCurrentPage(1);
  };

  const filteredData = applyFilters(equipo);

  const sortedData = [...filteredData].sort((a: any, b: any) => {
    if (!sortField) return 0;
    if (sortDirection === "asc") {
      return a[sortField] > b[sortField] ? 1 : -1;
    }
    return a[sortField] < b[sortField] ? 1 : -1;
  });

  const formSchema = z.object({
    // Información Básica
    nombre_equipo: z.string().min(1, "El nombre del equipo es requerido"),
    nro_serie: z.string().min(1, "El número de serie es requerido"),
    modelo: z.string().min(1, "El modelo es requerido"),
    numeroActivoFijo: z
      .string()
      .min(1, "El número de activo fijo es requerido"),
    marca: z.string().min(1, "La marca es requerida"),
    ubicacion_id: z.string().min(1, "La ubicación es requerida"),
    categoria: z.string().min(1, "La categoría es requerida"),
    fecha_registro: z.string().min(1, "La fecha de registro es requerida"),
    tipo_activo: z.string().min(1, "El tipo de activo es requerido"),
    garantia_fecha_fin: z.date().optional(),
    observaciones: z.string().optional(),
    // imagen: z.any(),

    // Especificaciones Técnicas
    procesador: z.string().min(1, "El procesador es requerido"),
    memoria_ram: z.string().min(1, "La memoria RAM es requerida"),
    almacenamiento: z.string().min(1, "El almacenamiento es requerido"),
    tarjeta_grafica: z.string().min(1, "La tarjeta gráfica es requerida"),
    pantalla: z.string().min(1, "La pantalla es requerida"),
    sistema_operativo: z.string().min(1, "El sistema operativo es requerido"),
    bateria: z.string().min(1, "La batería es requerida"),
    puertos: z.string().min(1, "Los puertos es requeridos"),

    // Seguridad
    nivel_acceso: z.string().min(1, "El nivel de acceso es requerido"),
    software_seguridad: z
      .string()
      .min(1, "El software de seguridad es requerido"),
    cifrado_disco: z.string().min(1, "El cifrado de disco es requerido"),
    politicas_aplicadas: z
      .array(z.string())
      .min(1, "Debe seleccionar al menos una política"),

    // Información de Adquisición
    orden_compra: z.string().min(1, "El orden de compra es requerido"),
    fecha_compra: z.string().min(1, "La fecha de compra es requerida"),
    precio_compra: z.number().min(1, "El precio de compra es requerido"),
    forma_pago: z.string().min(1, "El forma de pago es requerido"),
    plazo_pago: z.string().min(1, "El plazo de pago es requerido"),
    numero_factura: z.string().min(1, "El número de factura es requerido"),
    proveedor: z.string().min(1, "El proveedor es requerido"),

    // Información Administrativa
    codigo_inventario: z
      .string()
      .min(1, "El código de inventario es requerido"),
    centro_coste: z.string().min(1, "El centro de coste es requerido"),
    autorizado_por: z.string().min(1, "El autorizado por es requerido"),
    fecha_activacion: z.string().min(1, "La fecha de activación es requerida"),
    estado_contable: z.string().min(1, "El estado contable es requerido"),
    valor_depreciado: z
      .number()
      .min(0, "El valor depreciado debe ser positivo"),
    vida_util_restante: z.string().min(1, "La vida útil restante es requerida"),

    // Mantenimiento
    // frecuenciaMantenimiento: z.string(),
    // ultimaFechaMantenimiento: z.date().optional(),
    // proximaFechaMantenimiento: z.date().optional(),
    // proveedorServicio: z.string().optional(),

    // Documentación Relacionada
    // manualUsuario: z.any().optional(),
    // manualServicio: z.any().optional(),
    // certificados: z.any().optional(),
    // polizasSeguro: z.any().optional(),
    // documentosGarantia: z.any().optional(),
    // fotosAdicionales: z.any().optional(),

    // Campos Personalizables
    // tags: z.string(),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      ...newEquipo,
      fecha_registro: new Date().toISOString().split("T")[0],
      garantia_fecha_fin: null,
      imagen: null,
    },
  });

  const handleVolver = () => {
    navigate("/productos/lista");
  };

  const handleNuevoProducto = () => {
    navigate("/productos/ingreso");
  };

  const handleSubmit = async (data: Equipo) => {
    const dataSend = {
      ...data,
      fecha_registro: new Date(data.fecha_registro).toISOString(),
    };

    const response = await createEquipo(dataSend);
    if (response.success) {
      toast.success(response.message || "Equipo creado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 4500);
      navigate("/productos/lista");
    } else {
      throw new Error("Error al crear el equipo");
    }
  };

  const formatNumber = (value: number | string) => {
    const num = typeof value === "number" ? value.toString() : value;
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

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
      Object.keys(equipo[0]).join(","),
      ...filteredData.map((item) => Object.values(item).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.setAttribute("hidden", "");
    a.setAttribute("href", url);
    a.setAttribute("download", "inventario.csv");
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const uniqueMarcas = Array.from(new Set(equipo.map((item) => item.marcas)));

  const uniqueCategorias = Array.from(
    new Set(equipo.map((item) => item.categorias))
  );

  const uniqueEstados = Array.from(
    new Set(equipo.map((item) => item.estado_actual))
  );

  const uniqueSucursales = Array.from(
    new Set(equipo.map((item) => item.sucursales))
  );

  const activeFiltersCount = Object.values(filters).filter(
    (value) => value && value !== "todas" && value !== "todos"
  ).length;

  const getInfoEquipo = async (nroSeries: string) => {
    const response = await getEquiposByNroSerie(nroSeries);
    setNewEquipo(response);
  };

  const deleteEquipoById = async (id: number) => {
    if (!window.confirm("¿Está seguro de que desea eliminar este equipo?"))
      return;
    const response = await deleteEquipo(id);
    if (response.success) {
      toast.success(response.message || "Equipo eliminado exitosamente");
      setTimeout(() => {
        window.location.reload();
      }, 4500);
    }
  };

  return {
    deleteEquipoById,
    getInfoEquipo,
    equipo,
    setEquipo,
    newEquipo,
    setNewEquipo,
    handleVolver,
    form,
    handleSubmit,
    formatNumber,
    handleNuevoProducto,
    activeTab,
    setActiveTab,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    toggleColumnVisibility,
    handleFilterChange,
    resetFilters,
    sortedColumns,
    totalPages,
    paginatedData,
    handleSort,
    handleDownload,
    uniqueMarcas,
    uniqueEstados,
    uniqueSucursales,
    activeFiltersCount,
    searchTerm,
    setSearchTerm,
    sortField,
    sortDirection,
    filteredData,
    navigate,
    currentPage,
    setCurrentPage,
    columns,
    uniqueCategorias,
    filters,
    count,
    sedesConEquiposCount,
  };
};
